const RADON_UID = '54a8a239-ace3-4510-8fd4-7b4ddc370727'

function testDetails() {
    cy.get('[data-cy="div-dataset-detail-panel"]').should('be.visible')
    cy.get('[data-cy="div-dataset-details-title"]')
        .should('be.visible')
        .should('contain', 'Radonkarte')

    cy.get('[data-cy="panel-dataset-details-info"]')
        .should('be.visible')
        .should('contain', 'Die Radonkarte zeigt')

    cy.get('[data-cy="panel-dataset-details-downloads"]').should('exist').scrollIntoView()

    cy.get('[data-cy="panel-dataset-details-downloads"]')
        .should('be.visible')
        .find('li')
        .should('have.length', 1)

    cy.get('[data-cy="panel-dataset-details-links"]').should('exist').scrollIntoView()

    cy.get('[data-cy="panel-dataset-details-links"]')
        .should('be.visible')
        .find('li')
        .should('have.length', 6)
}

describe('Test the layer details on desktop', () => {
    beforeEach(() => {
        cy.viewport('macbook-15')
        cy.visit('/')
    })

    it('Shows the layer details from the search', () => {
        cy.get('[data-cy="input-search"]').type(RADON_UID)
        cy.get('[data-cy="ul-geocat-search-results"]')
            .find('li')
            .first()
            .find(`[data-cy="button-show-layer-details-${RADON_UID}"`)
            .click()

        testDetails()
    })

    it('Shows the layer details from the layer cart', () => {
        cy.get('[data-cy="input-search"]').type(RADON_UID)
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
    })

    it('Shows the layer details from the search', () => {
        cy.get('[data-cy="input-search"]').type(RADON_UID)
        cy.get('[data-cy="comp-data-accordion"]').click()
        cy.get('[data-cy="ul-geocat-search-results"]')
            .find('li')
            .first()
            .find(`[data-cy="button-show-layer-details-${RADON_UID}"`)
            .click()

        testDetails()
    })

    it('Shows the layer details from the layer cart', () => {
        cy.get('[data-cy="input-search"]').type(RADON_UID)
        cy.get('[data-cy="comp-data-accordion"]').click()
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
