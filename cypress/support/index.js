/**
 * Import our custom Cypress commands
 */
import './login';

/**
 * Install package that adds console messages to the Cypress output
 * to help when debugging issues.
 * https://github.com/archfz/cypress-terminal-report
 */
require('cypress-terminal-report').installSupport();

before(() => {
  cy.createTestUser();
});
