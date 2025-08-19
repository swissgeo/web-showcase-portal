const RADON_UID = '54a8a239-ace3-4510-8fd4-7b4ddc370727'

function testDetails() {
    cy.get('[data-cy="comp-layer-window"]').should('be.visible')
    cy.get('[data-cy="comp-layer-window-tabs"]').should('be.visible')
    cy.get('[data-cy="div-dataset-details-title"]')
        .should('be.visible')
        .should('contain', 'Radon map')

    cy.get('[data-cy="panel-dataset-details-info"]')
        .should('be.visible')
        .should('contain', 'The radon map indicates')


    cy.get('[data-cy="comp-layer-window-tabslist"]')
        .contains('Details')
        .click()

    cy.get('[data-cy="panel-dataset-details-downloads"]').should('exist').scrollIntoView()

    cy.get('[data-cy="panel-dataset-details-downloads"]')
        .should('be.visible')
        .find('li')
        .should('have.length', 1)

    cy.get('[data-cy="panel-dataset-details-links"]').should('exist').scrollIntoView()

    cy.get('[data-cy="panel-dataset-details-links"]')
        .should('be.visible')
        .find('li')
        .should('have.length', 1)
}

describe('Test the layer details on desktop', () => {
    beforeEach(() => {
        cy.viewport('macbook-15')
        cy.visit('/')
        cy.dismissWelcomeOverlay()
    })

    it('Shows the layer details from the search', () => {
        cy.get('[data-cy="input-search"]').type(RADON_UID)
        // open search results
        cy.get('[data-cy="comp-data-panel"]').click()
        cy.get('[data-cy="ul-geocat-search-results"]')
            .find('li')
            .first()
            .find(`[data-cy="button-show-layer-details-${RADON_UID}"`)
            .click()

        testDetails()
    })

    it('Search panel remains open when clicking detail button', () => {
        cy.get('[data-cy="input-search"]').type(RADON_UID)
        // open search results
        cy.get('[data-cy="comp-data-panel"]').click()

        // Verify search panel is visible
        cy.get('[data-cy="div-search-sidebar"]').should('be.visible')

        // Click detail button
        cy.get('[data-cy="ul-geocat-search-results"]')
            .find('li')
            .first()
            .find(`[data-cy="button-show-layer-details-${RADON_UID}"`)
            .click()

        // Verify both search panel and detail panel are visible
        cy.get('[data-cy="div-search-sidebar"]').should('be.visible')
        cy.get('[data-cy="div-layer-detail"]').should('be.visible')

        // Click the magnifying glass button to toggle search
        cy.get('[data-cy="button-search-panel"]').click()

        // Verify search panel is hidden but detail panel remains
        cy.get('[data-cy="div-search-sidebar"]').should('not.be.visible')
        cy.get('[data-cy="div-layer-detail"]').should('be.visible')

        // Click the magnifying glass button again to show search
        cy.get('[data-cy="button-search-panel"]').click()

        // Verify both panels are visible again
        cy.get('[data-cy="div-search-sidebar"]').should('be.visible')
        cy.get('[data-cy="div-layer-detail"]').should('be.visible')
    })

    it('Shows the layer details from the layer cart', () => {
        cy.get('[data-cy="input-search"]').type(RADON_UID)
        // open search results
        cy.get('[data-cy="comp-data-panel"]').click()
        cy.get('[data-cy="ul-geocat-search-results"]')
            .find('li')
            .first()
            .find(`[data-cy="add-result-${RADON_UID}"`)
            .click()

        cy.get('[data-cy="button-layer-cart"]').click()
        cy.get(`[data-cy="button-layer-item-${RADON_UID}"]`).click()
        cy.get(`#overlay_menu_list`).find('span').contains('Details').click()

        testDetails()
    })
})

describe('Test the layer details on mobile', () => {
    beforeEach(() => {
        cy.viewport('iphone-se2')
        cy.visit('/')
        cy.dismissWelcomeOverlay()
    })

    it('Shows the layer details from the search', () => {
        cy.get('[data-cy="input-search"]').type(RADON_UID)
        cy.get('[data-cy="comp-data-panel"]').click()
        cy.get('[data-cy="ul-geocat-search-results"]')
            .find('li')
            .first()
            .find(`[data-cy="button-show-layer-details-${RADON_UID}"`)
            .click()

        testDetails()
    })

    it('Shows the layer details from the layer cart', () => {
        cy.get('[data-cy="input-search"]').type(RADON_UID)
        cy.get('[data-cy="comp-data-panel"]').click()
        cy.get('[data-cy="ul-geocat-search-results"]')
            .find('li')
            .first()
            .find(`[data-cy="add-result-${RADON_UID}"`)
            .click()

        cy.get('[data-cy="button-layer-cart"]').click()
        cy.get(`[data-cy="button-layer-item-${RADON_UID}"]`).click()
        cy.get(`#overlay_menu_list`).find('span').contains('Details').click()

        testDetails()
    })

    it('Search panel remains accessible when clicking detail button on mobile', () => {
        cy.get('[data-cy="input-search"]').type(RADON_UID)
        cy.get('[data-cy="comp-data-panel"]').click()

        // Verify search results are visible
        cy.get('[data-cy="comp-search-results-mobile"]').should('be.visible')

        // Click detail button
        cy.get('[data-cy="ul-geocat-search-results"]')
            .find('li')
            .first()
            .find(`[data-cy="button-show-layer-details-${RADON_UID}"`)
            .click()

        // Verify detail panel is visible
        cy.get('[data-cy="div-layer-detail"]').should('be.visible')

        // Verify search results are still available by clicking back from detail panel
        cy.get('[data-cy="comp-layer-window-close"]').click()

        // After closing detail panel, search should still be accessible
        cy.get('[data-cy="comp-search-results-mobile"]').should('be.visible')
    })
})
