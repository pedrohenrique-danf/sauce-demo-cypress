// Comandos customizados reutilizados pelos três requisitos.
// Os seletores usam o atributo data-test, que é o padrão recomendado pelo Cypress
// (independe de classes CSS e textos que podem mudar).

const sel = (dataTest) => `[data-test="${dataTest}"]`;
Cypress.Commands.add('getByTest', (dataTest, options) => cy.get(sel(dataTest), options));

// Pré-condição comum (critério de entrada do plano de teste):
// "catálogo de produtos funcional após autenticação prévia".
// Login está FORA do escopo de teste, por isso é apenas um passo de preparação.
Cypress.Commands.add('login', () => {
  cy.fixture('produtos').then(({ usuario }) => {
    cy.visit('/');
    cy.getByTest('username').type(usuario.username);
    cy.getByTest('password').type(usuario.password, { log: false });
    cy.getByTest('login-button').click();
  });
  cy.location('pathname').should('eq', '/inventory.html');
  cy.getByTest('title').should('have.text', 'Products');
});

// ---------- Catálogo ----------
Cypress.Commands.add('adicionarAoCarrinho', (slug) => {
  cy.getByTest(`add-to-cart-${slug}`).click();
  cy.getByTest(`remove-${slug}`).should('be.visible').and('have.text', 'Remove');
});

Cypress.Commands.add('removerDoCatalogo', (slug) => {
  cy.getByTest(`remove-${slug}`).click();
  cy.getByTest(`add-to-cart-${slug}`).should('be.visible').and('have.text', 'Add to cart');
});

Cypress.Commands.add('ordenarPor', (valor) => {
  // az | za | lohi | hilo
  cy.getByTest('product-sort-container').select(valor);
});

// Retorna os nomes exibidos no catálogo, na ordem da tela
Cypress.Commands.add('nomesDoCatalogo', () =>
  cy.getByTest('inventory-item-name').then(($els) => Cypress._.map($els, (el) => el.innerText.trim())),
);

// Retorna os preços exibidos (número) na ordem da tela
Cypress.Commands.add('precosDoCatalogo', () =>
  cy
    .getByTest('inventory-item-price')
    .then(($els) => Cypress._.map($els, (el) => Number(el.innerText.replace('$', '')))),
);

// Lê nome, descrição e preço de um item (catálogo, detalhe ou carrinho)
Cypress.Commands.add('dadosDoItem', { prevSubject: 'element' }, ($item) => {
  const txt = (dt) => Cypress.$($item).find(sel(dt)).first().text().trim();
  return {
    nome: txt('inventory-item-name'),
    descricao: txt('inventory-item-desc'),
    preco: txt('inventory-item-price'),
  };
});

// ---------- Carrinho ----------
Cypress.Commands.add('contadorDoCarrinhoDeveSer', (qtd) => {
  if (qtd === 0) {
    cy.getByTest('shopping-cart-badge').should('not.exist');
  } else {
    cy.getByTest('shopping-cart-badge').should('be.visible').and('have.text', String(qtd));
  }
});

Cypress.Commands.add('abrirCarrinho', () => {
  cy.getByTest('shopping-cart-link').click();
  cy.location('pathname').should('eq', '/cart.html');
  cy.getByTest('title').should('have.text', 'Your Cart');
});

// ---------- Menu lateral ----------
Cypress.Commands.add('abrirMenu', () => {
  cy.get('#react-burger-menu-btn').click();
  cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'false');
});

Cypress.Commands.add('clicarNoMenu', (dataTest) => {
  cy.abrirMenu();
  cy.getByTest(dataTest).should('be.visible').click();
});
