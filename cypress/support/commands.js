// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/routes/auth/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command to check if an element is visible in the viewport
Cypress.Commands.add('isInViewport', { prevSubject: true }, (subject) => {
  const bottom = Cypress.$(cy.state('window')).height();
  const rect = subject[0].getBoundingClientRect();
  
  expect(rect.top).to.be.lessThan(bottom);
  expect(rect.bottom).to.be.greaterThan(0);
  
  return subject;
});

// Custom command to wait for images to load
Cypress.Commands.add('waitForImagesLoaded', { prevSubject: 'element' }, (subject) => {
  const images = subject.find('img');
  if (images.length === 0) {
    return subject;
  }
  
  const promises = [];
  images.each((i, img) => {
    if (img.complete) {
      return;
    }
    
    const promise = new Promise((resolve) => {
      img.addEventListener('load', () => {
        resolve();
      });
      
      img.addEventListener('error', () => {
        resolve();
      });
    });
    
    promises.push(promise);
  });
  
  return cy.wrap(Promise.all(promises), { log: false }).then(() => {
    return subject;
  });
}); 