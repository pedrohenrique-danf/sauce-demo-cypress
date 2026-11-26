// Arquivo carregado automaticamente antes de cada spec.
import 'cypress-mochawesome-reporter/register';
import './commands';

// Evidência: um screenshot ao final de cada caso de teste (passou ou falhou).
// Os arquivos ficam em cypress/screenshots/<spec>/<título do teste>.png
afterEach(function () {
  const titulo = this.currentTest.title.replace(/[^\w\- ]+/g, '').trim();
  cy.screenshot(`evidencia - ${titulo}`, { capture: 'viewport' });
});
