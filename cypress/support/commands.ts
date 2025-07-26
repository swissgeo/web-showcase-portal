// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command to dismiss the welcome overlay
Cypress.Commands.add('dismissWelcomeOverlay', () => {
  // Only set localStorage on the first visit
  cy.window().then((win) => {
    // Set localStorage to not show overlay again
    win.localStorage.setItem('dontShowWelcomeOverlayAgain', 'true')
  })

  // Still check if overlay is visible and dismiss it if needed
  cy.get('body').then(($body) => {
    if ($body.find('[data-cy="button-overlay-confirm"]').length > 0) {
      cy.get('[data-cy="button-overlay-confirm"]').click()
    }
  })
})
