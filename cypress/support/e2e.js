// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Import Cypress Testing Library commands
import '@testing-library/cypress/add-commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests in the command log
const app = window.top;
if (app) {
  app.document.addEventListener('DOMContentLoaded', () => {
    const style = app.document.createElement('style');
    style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
    app.document.head.appendChild(style);
  });
}

// Ignore uncaught exceptions from the application
// This is particularly useful for Next.js hydration errors
Cypress.on('uncaught:exception', (err, runnable) => {
  // Check if the error is related to hydration
  if (err.message.includes('Text content does not match server-rendered HTML') ||
      err.message.includes('Hydration failed') ||
      err.message.includes('There was an error while hydrating')) {
    // Returning false here prevents Cypress from failing the test
    return false;
  }
  
  // We still want to fail the test for other errors
  return true;
}); 