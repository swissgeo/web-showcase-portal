// Add custom command types to the Cypress namespace

/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to dismiss the welcome overlay.
         * @example cy.dismissWelcomeOverlay()
         */
        dismissWelcomeOverlay(): Chainable<void>
    }
}
