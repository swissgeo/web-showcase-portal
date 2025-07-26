// from https://www.cypress.io/blog/working-with-iframes-in-cypress
const getIframeDocument = () => {
    return cy.get('[data-cy="iframe-mapviewer"]').its('0.contentDocument').should('exist')
}

describe('Test the map on desktop', () => {
    beforeEach(() => {
        cy.intercept('GET', 'https://api3.geo.admin.ch/rest/services/all/MapServer/layersConfig?lang=de').as('layersConfig')
        cy.intercept('GET', 'https://api3.geo.admin.ch/rest/services').as('services')
        cy.intercept('GET', 'https://api3.geo.admin.ch/rest/services/ech/CatalogServer?lang=de').as('catalogServer')
        cy.viewport('macbook-15')
        cy.visit('/')
        cy.wait(['@layersConfig', '@services', '@catalogServer'])
        cy.dismissWelcomeOverlay()
    })
    it('renders the map', () => {
        cy.log('Test if the map renders and can be zoomed in and out')
        cy.get('[data-cy="iframe-mapviewer"]').should('exist')
        cy.get('[data-cy="zoom-button-group"]').should('exist')
        cy.get('[data-cy="zoom-out"]').should('exist')
        // the zoom out button is enabled because the default zoom level is 2
        cy.get('[data-cy="zoom-out"]').should('be.enabled')

        cy.get('[data-cy="zoom-in"]').should('exist')
        cy.get('[data-cy="zoom-in"]').click()
        getIframeDocument()
            .its('location.href')
            .should('match', /(?:\?|&)z=3/)
        cy.get('[data-cy="zoom-in"]').click()

        getIframeDocument()
            .its('location.href')
            .should('match', /(?:\?|&)z=4/)

        cy.get('[data-cy="zoom-out"]').click()
        getIframeDocument()
            .its('location.href')
            .should('match', /(?:\?|&)z=3/)

        // Zoom out to minimum level (1) and check that zoom out button is disabled
        cy.get('[data-cy="zoom-out"]').click()
        getIframeDocument()
            .its('location.href')
            .should('match', /(?:\?|&)z=2/)

        cy.get('[data-cy="zoom-out"]').click()
        getIframeDocument()
            .its('location.href')
            .should('match', /(?:\?|&)z=1/)

        // At zoom level 1 (minimum), the zoom out button should be disabled
        cy.get('[data-cy="zoom-out"]').should('be.disabled')
    })
    it('loads a search result on the map', () => {
        cy.get('[data-cy="input-search"]').type('wald')
        cy.log(
            'adding the layer "swissTLM3D Wald" to the map and checking that a tile is request (that it was correctly loaded)'
        )
        // open accordion
        cy.get('[data-cy="comp-data-accordion"]').click()
        cy.get('[data-cy="add-result-cdb289d5-db16-4440-8529-5807a262f6a2"]').click()
        getIframeDocument().its('location.href').should(
            'contain',
            // %7C == | encoded for URLs
            'WMS%7Chttps://wms.geo.admin.ch/%7Cch.swisstopo.swisstlm3d-wald'
        )
    })
})

describe('Test the map on mobile', () => {
    beforeEach(() => {
        cy.viewport('iphone-se2')
        cy.visit('/')
        cy.dismissWelcomeOverlay()
    })
    it('renders the map', () => {
        cy.log('Test if the map zoom buttons are not present')

        cy.get('[data-cy="iframe-mapviewer"]').should('exist')
        cy.get('[data-cy="zoom-button-group"]').should('not.exist')
    })
})
