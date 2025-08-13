const RADON_UID = '54a8a239-ace3-4510-8fd4-7b4ddc370727'

describe('Layer Legend on desktop', () => {
    beforeEach(() => {
        cy.viewport('macbook-15')
        cy.visit('/')
        cy.dismissWelcomeOverlay()
    })

    it('Shows the legend of Radon', () => {
        cy.intercept(
            'https://wms.geo.admin.ch/?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&FORMAT=text%2Fxml'
        ).as('legendGraphicRequest')
        cy.get('[data-cy="input-search"]').type(RADON_UID)

        cy.get('[data-cy="comp-data-panel"]').click()
        cy.get('[data-cy="ul-geocat-search-results"]')
            .find('li')
            .first()
            .find(`[data-cy="add-result-${RADON_UID}"`)
            .click()

        cy.get(`[data-cy="button-show-layer-details-${RADON_UID}"]`).should('be.visible').click()

        cy.get('[data-cy="comp-layer-window-tabslist"]')
            .contains('Legend')
            .click()

        cy.get('[data-cy="div-layer-legend"]').should('be.visible')
        cy.get(`[data-cy="accordion-layer-legend-${RADON_UID}"]`).click()
        cy.wait('@legendGraphicRequest')
    })
})

describe('Layer Legend on mobile', () => {
    beforeEach(() => {
        cy.viewport('iphone-se2')
        cy.visit('/')
        cy.dismissWelcomeOverlay()
    })

    it('Shows the legend of Radon', () => {
        cy.intercept(
            'https://wms.geo.admin.ch/?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&FORMAT=text%2Fxml'
        ).as('legendGraphicRequest')
        cy.get('[data-cy="input-search"]').type(RADON_UID)
        cy.get('[data-cy="comp-data-panel"]').click()

        cy.get('[data-cy="ul-geocat-search-results"]')
            .find('li')
            .first()
            .find(`[data-cy="add-result-${RADON_UID}"`)
            .click()

        cy.get(`[data-cy="button-show-layer-details-${RADON_UID}"]`).should('be.visible').click()

        cy.get('[data-cy="comp-layer-window-tabslist"]')
            .contains('Legend')
            .click()

        cy.get('[data-cy="div-layer-legend"]').should('be.visible')
        cy.get(`[data-cy="accordion-layer-legend-${RADON_UID}"]`).click()
        cy.wait('@legendGraphicRequest')
    })
})
