# SauceDemo (Swag Labs): Automação de Testes E2E com Cypress

**Disciplina:** Qualidade e Teste de Software. **Projeto:** Entrega 3.
**Analista:** Pedro Henrique Daniel Ferreira (202421023)
**Sistema sob teste:** https://www.saucedemo.com/ (usuário `standard_user`)

Este projeto automatiza os 15 casos de teste (CT01 a CT15) já documentados nas entregas
anteriores (Plano de Teste e Casos de Teste). Eles estão divididos em três requisitos:

| Requisito | Arquivo de teste | Casos | Regras de negócio | Riscos |
|---|---|---|---|---|
| RQ01: Catálogo de Produtos | `cypress/e2e/rq01_catalogo.cy.js` | CT01 a CT05 | RN01, RN02, RN03 | R3, R2 |
| RQ02: Carrinho de Compras | `cypress/e2e/rq02_carrinho.cy.js` | CT06 a CT10 | RN04, RN05, RN06 | R2 |
| RQ03: Menu Lateral de Navegação | `cypress/e2e/rq03_menu_lateral.cy.js` | CT11 a CT15 | RN05, RN07, RN08 | R2, R4 |

A descrição completa dos requisitos fica em [`docs/requisitos.md`](docs/requisitos.md).

## Estrutura

```
saucedemo-cypress-e2e/
├── cypress.config.js          # baseUrl, viewport, reporter HTML (mochawesome)
├── package.json               # scripts de execução
├── cypress/
│   ├── e2e/                   # uma spec por requisito (RQ01, RQ02, RQ03)
│   ├── fixtures/produtos.json # massa de dados: catálogo, preços, ordenações, menu
│   └── support/
│       ├── commands.js        # comandos reutilizáveis (login, carrinho, menu...)
│       └── e2e.js             # screenshot de evidência ao fim de cada teste
└── docs/requisitos.md         # lista dos 3 requisitos validados
```

Boas práticas do Cypress aplicadas:
- seletores pelo atributo `data-test`, sem depender de classes CSS ou da posição dos elementos;
- testes independentes: `testIsolation` limpa cookies e localStorage entre os testes, e cada teste faz login e monta o próprio estado;
- comandos customizados (`cy.login`, `cy.adicionarAoCarrinho`, `cy.abrirMenu`…) para evitar repetição;
- massa de dados separada do código, em `fixtures`;
- asserções com *retry* automático (`should`), sem `cy.wait` fixo.

O login é apenas uma pré-condição. Ele está **fora do escopo** de teste definido no Plano de Teste.

## Como executar

Pré-requisitos: Node.js 18 ou mais recente e Google Chrome.

```bash
npm install            # instala o Cypress e o gerador de relatório
npx cypress open       # modo interativo (escolha E2E Testing > Chrome)
npm test               # modo headless: roda as 3 specs no Chrome
npm run test:rq01      # roda apenas um requisito (rq01 | rq02 | rq03)
```

Saídas geradas após `npm test`:
- `cypress/reports/html/index.html`: **relatório HTML da execução**, com gráficos, status de cada CT e screenshots das falhas;
- `cypress/screenshots/`: evidência (screenshot) de cada caso de teste.
