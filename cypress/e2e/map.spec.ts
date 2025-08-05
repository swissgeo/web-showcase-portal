// from https://www.cypress.io/blog/working-with-iframes-in-cypress
const getIframeDocument = () => {
    return cy.get('[data-cy="iframe-mapviewer"]').its('0.contentDocument').should('exist')
}

describe('Test the map on desktop', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/layersConfig?*', { headers: { 'cache-control': 'no-cache' } }).as('layersConfig')
        cy.intercept('GET', '**/services', { headers: { 'cache-control': 'no-cache' } }).as('services')
        cy.intercept('GET', '**/CatalogServer?*', { headers: { 'cache-control': 'no-cache' } }).as('catalogServer')
        cy.viewport('macbook-15')
        cy.visit('/')
        cy.get('[data-cy="iframe-mapviewer"]').should('exist')
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

    it('tests geolocation button functionality', () => {
        cy.log('Test if the geolocation button toggles geolocation parameter in URL')

        // Check if geolocation button exists
        cy.get('[data-cy="geolocation-button"]').should('exist')

        // Initially, geolocation should not be in URL
        getIframeDocument()
            .its('location.href')
            .should('not.match', /(?:\?|&)geolocation=true/)

        // Mock geolocation to avoid browser permission prompts
        cy.window().then((win) => {
            cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((success) => {
                // Simulate a location in Switzerland (Bern)
                const position = {
                    coords: {
                        latitude: 46.9481,
                        longitude: 7.4474,
                        accuracy: 10
                    }
                }
                success(position)
            })
        })

        // Click geolocation button to enable
        cy.get('[data-cy="geolocation-button"]').click()

        // Wait for the geolocation process to complete
        cy.get('[data-cy="geolocation-button"]').should('not.have.class', 'p-button-loading')

        // Check if geolocation parameter is added to URL
        getIframeDocument()
            .its('location.href')
            .should('match', /(?:\?|&)geolocation=true/)

        // Click again to disable
        cy.get('[data-cy="geolocation-button"]').click()

        // Check if geolocation parameter is removed from URL
        getIframeDocument()
            .its('location.href')
            .should('not.match', /(?:\?|&)geolocation=true/)
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
            'WMS%7Chttps%3A%2F%2Fwms.geo.admin.ch%2F%7Cch.swisstopo.swisstlm3d-wald'
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
