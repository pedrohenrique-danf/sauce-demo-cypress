# Lista dos 3 requisitos validados

Sistema: SauceDemo (Swag Labs). Usuário de teste: `standard_user`.
Os requisitos e as regras de negócio vêm do documento de Casos de Teste da Entrega 2.

## RQ01: Catálogo de Produtos
O sistema deve listar os 6 produtos do catálogo com preço correto, permitir a ordenação
e exibir a página de detalhes de cada produto.

- **RN01:** o catálogo tem 6 produtos com os preços: Backpack $29.99, Bike Light $9.99,
  Bolt T-Shirt $15.99, Fleece Jacket $49.99, Onesie $7.99 e Test.allTheThings() T-Shirt (Red) $15.99.
  Os preços aparecem com o símbolo `$` e 2 casas decimais.
- **RN02:** a ordenação oferece Name (A to Z), Name (Z to A), Price (low to high) e Price (high to low).
  O padrão é A to Z. Ordenar muda apenas a ordem dos produtos, nunca os preços.
- **RN03:** a página de detalhes exibe nome, descrição, preço e imagem iguais aos do catálogo.
  O botão *Back to products* volta ao catálogo sem perder o carrinho.
- Casos: CT01 a CT05. Riscos: R3 (Médio) e R2 (Alto).

## RQ02: Carrinho de Compras
O sistema deve permitir adicionar e remover itens, manter o contador do carrinho
coerente e preservar os itens durante a navegação.

- **RN04:** o contador do ícone do carrinho reflete a quantidade de itens. O botão do produto
  alterna entre *Add to cart* e *Remove*. É possível remover pelo catálogo ou pelo carrinho.
- **RN05:** os itens e o contador se mantêm ao navegar entre catálogo, detalhes e carrinho.
- **RN06:** o carrinho exibe nome, descrição, preço e quantidade iguais aos do catálogo.
- Casos: CT06 a CT10. Risco: R2 (Alto). Técnica: Transição de Estados.

## RQ03: Menu Lateral de Navegação
O menu lateral deve oferecer All Items, About, Logout e Reset App State, cada um com o
comportamento esperado.

- **RN05:** *All Items* volta ao catálogo preservando o carrinho.
- **RN07:** *Reset App State* esvazia o carrinho, remove o contador e faz todos os botões
  voltarem a *Add to cart* sem recarregar a página.
- **RN08:** o menu tem 5 itens: All Items, Dynamic Catalog, About, Logout e Reset App State.
  *About* abre saucelabs.com sem erro. (O item *Dynamic Catalog* foi adicionado ao site depois
  da especificação original, que listava 4 itens; o requisito foi atualizado.)
- Casos: CT11 a CT15. Riscos: R2 (Alto) e R4 (Baixo).

### Defeito encontrado
- **DEF01 (RN07, risco R2):** após *Reset App State*, o contador do carrinho some e o carrinho
  fica vazio, mas os botões dos produtos continuam como *Remove* até a página ser recarregada.
  O CT13 registra o defeito e recarrega a página para validar o restante do comportamento.
