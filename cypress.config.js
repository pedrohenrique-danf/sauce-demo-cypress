const { defineConfig } = require('cypress');

module.exports = defineConfig({
  // Relatório HTML da execução (cypress/reports/html/index.html)
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/html',
    reportPageTitle: 'SauceDemo - Relatório de Execução E2E (Entrega 3)',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },

  viewportWidth: 1366,
  viewportHeight: 768,
  defaultCommandTimeout: 8000,
  video: false,
  screenshotOnRunFailure: true,

  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    // Cada teste começa com estado limpo (cookies + localStorage zerados),
    // garantindo independência entre os casos de teste.
    testIsolation: true,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
});
