/// <reference types="cypress" />
/**
 * RQ01 – Catálogo de Produtos
 * Regras de negócio: RN01 (catálogo/preços), RN02 (ordenação), RN03 (detalhes)
 * Técnicas: particionamento de equivalência (opções de ordenação), análise de valor
 * limite (menor e maior preço nas pontas da ordenação).
 */
describe('RQ01 – Catálogo de Produtos', () => {
  let dados;

  before(() => {
    cy.fixture('produtos').then((f) => {
      dados = f;
    });
  });

  beforeEach(() => {
    cy.login();
  });

  context('Cenário 1.1 – Listagem e ordenação', () => {
    it('CT01 – Validar preço de cada produto (RN01)', () => {
      cy.getByTest('inventory-item').should('have.length', dados.catalogo.length);

      dados.catalogo.forEach((produto) => {
        cy.contains('[data-test="inventory-item"]', produto.nome).within(() => {
          cy.getByTest('inventory-item-price')
            .invoke('text')
            .should('match', /^\$\d+\.\d{2}$/) // símbolo $ + 2 casas decimais
            .and('eq', `$${produto.preco.toFixed(2)}`);
        });
      });
    });

    it('CT02 – Validar ordenação Price (low to high) sem alterar preços (RN02)', () => {
      // Padrão inicial deve ser Name (A to Z)
      cy.getByTest('active-option').should('have.text', 'Name (A to Z)');

      cy.ordenarPor('lohi');
      cy.getByTest('active-option').should('have.text', 'Price (low to high)');

      cy.precosDoCatalogo().should('deep.equal', dados.ordenacao.precoMenorParaMaior);

      // Valor limite: primeiro = menor preço, último = maior preço
      cy.getByTest('inventory-item-price').first().should('have.text', '$7.99');
      cy.getByTest('inventory-item-price').last().should('have.text', '$49.99');

      // Ordenar não pode alterar o preço de nenhum produto
      dados.catalogo.forEach((produto) => {
        cy.contains('[data-test="inventory-item"]', produto.nome)
          .find('[data-test="inventory-item-price"]')
          .should('have.text', `$${produto.preco.toFixed(2)}`);
      });
    });

    it('CT03 – Validar ordenação Name (Z to A) (RN02)', () => {
      cy.ordenarPor('za');
      cy.getByTest('active-option').should('have.text', 'Name (Z to A)');
      cy.nomesDoCatalogo().should('deep.equal', dados.ordenacao.nomeZaA);
    });
  });

  context('Cenário 1.2 – Detalhes do produto', () => {
    it('CT04 – Abrir detalhes pelo nome do produto: dados iguais aos do catálogo (RN03)', () => {
      // Executado para os 6 produtos (cobertura completa da partição)
      dados.catalogo.forEach((produto) => {
        cy.contains('[data-test="inventory-item"]', produto.nome).then(($card) => {
          const noCatalogo = {
            nome: $card.find('[data-test="inventory-item-name"]').text().trim(),
            descricao: $card.find('[data-test="inventory-item-desc"]').text().trim(),
            preco: $card.find('[data-test="inventory-item-price"]').text().trim(),
            imagem: $card.find('img').attr('src'),
          };

          cy.wrap($card).find('[data-test="inventory-item-name"]').click();
          cy.location('pathname').should('eq', '/inventory-item.html');

          cy.getByTest('inventory-item-name').should('have.text', noCatalogo.nome);
          cy.getByTest('inventory-item-desc').should('have.text', noCatalogo.descricao);
          cy.getByTest('inventory-item-price').should('have.text', noCatalogo.preco);
          cy.get('.inventory_details_img')
            .should('be.visible')
            .and('have.attr', 'src', noCatalogo.imagem)
            .and(($img) => {
              // imagem carregada de fato (não quebrada)
              expect($img[0].naturalWidth, 'largura natural da imagem').to.be.greaterThan(0);
            });

          cy.getByTest('back-to-products').click();
          cy.location('pathname').should('eq', '/inventory.html');
        });
      });
    });

    it('CT05 – Voltar ao catálogo (Back to products) preservando o carrinho (RN03/RN05)', () => {
      cy.adicionarAoCarrinho('sauce-labs-backpack');
      cy.contadorDoCarrinhoDeveSer(1);

      cy.contains('[data-test="inventory-item-name"]', 'Sauce Labs Bike Light').click();
      cy.location('pathname').should('eq', '/inventory-item.html');
      cy.contadorDoCarrinhoDeveSer(1);

      cy.getByTest('back-to-products').click();
      cy.location('pathname').should('eq', '/inventory.html');
      cy.contadorDoCarrinhoDeveSer(1);
      cy.getByTest('remove-sauce-labs-backpack').should('have.text', 'Remove');
      cy.getByTest('add-to-cart-sauce-labs-bike-light').should('have.text', 'Add to cart');
    });
  });
});
