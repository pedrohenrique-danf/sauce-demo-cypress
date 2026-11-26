/// <reference types="cypress" />
/**
 * RQ02 – Carrinho de Compras
 * Regras de negócio: RN04 (contador/botões), RN05 (persistência), RN06 (conteúdo)
 * Técnica: transição de estados do item  (Fora do carrinho) ⇄ (No carrinho)
 * Risco associado: R2 (Alto) – perda de itens do carrinho durante a navegação.
 */
describe('RQ02 – Carrinho de Compras', () => {
  beforeEach(() => {
    cy.login();
    cy.contadorDoCarrinhoDeveSer(0); // estado inicial: carrinho vazio
  });

  context('Cenário 2.1 – Adição e remoção de itens (Transição de Estados)', () => {
    it('CT06 – Adicionar 1 item: contador = 1 e botão vira Remove (RN04)', () => {
      cy.getByTest('add-to-cart-sauce-labs-backpack').should('have.text', 'Add to cart').click();
      cy.getByTest('remove-sauce-labs-backpack').should('have.text', 'Remove');
      cy.contadorDoCarrinhoDeveSer(1);
    });

    it('CT07 – Remover item pelo catálogo: contador decrementa e botão volta a Add to cart (RN04)', () => {
      cy.adicionarAoCarrinho('sauce-labs-backpack');
      cy.adicionarAoCarrinho('sauce-labs-bike-light');
      cy.contadorDoCarrinhoDeveSer(2);

      cy.removerDoCatalogo('sauce-labs-backpack');
      cy.contadorDoCarrinhoDeveSer(1);

      // Valor limite: remover o último item faz o contador desaparecer
      cy.removerDoCatalogo('sauce-labs-bike-light');
      cy.contadorDoCarrinhoDeveSer(0);
    });

    it('CT08 – Remover item pela página do carrinho: item some e contador decrementa (RN04)', () => {
      cy.adicionarAoCarrinho('sauce-labs-backpack');
      cy.adicionarAoCarrinho('sauce-labs-bike-light');
      cy.abrirCarrinho();
      cy.getByTest('inventory-item').should('have.length', 2);

      cy.getByTest('remove-sauce-labs-backpack').click();

      cy.getByTest('inventory-item').should('have.length', 1);
      cy.getByTest('inventory-item-name').should('not.contain', 'Sauce Labs Backpack');
      cy.contadorDoCarrinhoDeveSer(1);

      // O catálogo deve refletir a remoção feita no carrinho
      cy.getByTest('continue-shopping').click();
      cy.getByTest('add-to-cart-sauce-labs-backpack').should('have.text', 'Add to cart');
      cy.getByTest('remove-sauce-labs-bike-light').should('have.text', 'Remove');
    });
  });

  context('Cenário 2.2 – Persistência e conteúdo do carrinho', () => {
    it('CT09 – Persistência ao navegar catálogo → detalhes → carrinho (RN05)', () => {
      cy.adicionarAoCarrinho('sauce-labs-backpack');
      cy.adicionarAoCarrinho('sauce-labs-onesie');
      cy.contadorDoCarrinhoDeveSer(2);

      // Detalhes
      cy.contains('[data-test="inventory-item-name"]', 'Sauce Labs Backpack').click();
      cy.location('pathname').should('eq', '/inventory-item.html');
      cy.contadorDoCarrinhoDeveSer(2);
      cy.getByTest('remove').should('have.text', 'Remove'); // botão do detalhe reflete o estado

      // Carrinho
      cy.abrirCarrinho();
      cy.contadorDoCarrinhoDeveSer(2);
      cy.getByTest('inventory-item-name').then(($n) => {
        expect(Cypress._.map($n, (el) => el.innerText.trim())).to.have.members([
          'Sauce Labs Backpack',
          'Sauce Labs Onesie',
        ]);
      });

      // De volta ao catálogo
      cy.getByTest('continue-shopping').click();
      cy.location('pathname').should('eq', '/inventory.html');
      cy.contadorDoCarrinhoDeveSer(2);
    });

    it('CT10 – Validar dados dos itens na página do carrinho (RN06)', () => {
      const slugs = ['sauce-labs-backpack', 'sauce-labs-fleece-jacket', 'sauce-labs-onesie'];
      const noCatalogo = {};

      slugs.forEach((slug) => {
        cy.getByTest(`add-to-cart-${slug}`)
          .closest('[data-test="inventory-item"]')
          .dadosDoItem()
          .then((d) => {
            noCatalogo[d.nome] = d;
          });
        cy.adicionarAoCarrinho(slug);
      });

      cy.abrirCarrinho();
      cy.getByTest('inventory-item').should('have.length', slugs.length);

      cy.getByTest('inventory-item').each(($item) => {
        cy.wrap($item)
          .dadosDoItem()
          .then((noCarrinho) => {
            const esperado = noCatalogo[noCarrinho.nome];
            expect(esperado, `item "${noCarrinho.nome}" foi adicionado`).to.exist;
            expect(noCarrinho.descricao, 'descrição').to.eq(esperado.descricao);
            expect(noCarrinho.preco, 'preço').to.eq(esperado.preco);
          });
        cy.wrap($item).find('[data-test="item-quantity"]').should('have.text', '1');
      });
    });
  });
});
