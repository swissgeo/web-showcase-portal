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

    it('handles geolocation outside Switzerland', () => {
        cy.log('Test geolocation functionality when user is outside Switzerland')

        // Mock geolocation to return a location outside Switzerland (e.g., Paris, France)
        cy.window().then((win) => {
            cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((success) => {
                const position = {
                    coords: {
                        latitude: 48.8566,  // Paris latitude
                        longitude: 2.3522,  // Paris longitude
                        accuracy: 10
                    }
                }
                success(position)
            })
        })

        // Click geolocation button
        cy.get('[data-cy="geolocation-button"]').click()

        // Wait for the geolocation process to complete
        cy.get('[data-cy="geolocation-button"]').should('not.have.class', 'p-button-loading')

        // The application might show an error message or handle it gracefully
        // Check if URL still updates or if there's an error message
        cy.get('body').then(($body) => {
            // Check if there's an error message displayed
            if ($body.find('[data-cy="error-message"]').length > 0) {
                cy.get('[data-cy="error-message"]').should('be.visible')
            } else {
                // Or check if geolocation is still added to URL despite being outside Switzerland
                getIframeDocument()
                    .its('location.href')
                    .should('match', /(?:\?|&)geolocation=true/)
            }
        })
    })

    it('handles geolocation permission denied', () => {
        cy.log('Test geolocation functionality when permission is denied')

        // Mock geolocation to simulate permission denied
        cy.window().then((win) => {
            cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((success, error) => {
                const permissionError = {
                    code: 1, // PERMISSION_DENIED
                    message: 'User denied the request for Geolocation.'
                }
                error(permissionError)
            })
        })

        // Click geolocation button
        cy.get('[data-cy="geolocation-button"]').click()

        // Wait for the geolocation process to complete
        cy.get('[data-cy="geolocation-button"]').should('not.have.class', 'p-button-loading')

        // Check that geolocation parameter is NOT added to URL
        getIframeDocument()
            .its('location.href')
            .should('not.match', /(?:\?|&)geolocation=true/)

        // Check if an error message is displayed
        cy.get('body').then(($body) => {
            if ($body.find('[data-cy="error-message"]').length > 0) {
                cy.get('[data-cy="error-message"]').should('be.visible')
                cy.get('[data-cy="error-message"]').should('contain.text', 'permission')
            }
        })
    })

    it('handles geolocation timeout error', () => {
        cy.log('Test geolocation functionality when timeout occurs')

        // Mock geolocation to simulate timeout
        cy.window().then((win) => {
            cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((success, error) => {
                const timeoutError = {
                    code: 3, // TIMEOUT
                    message: 'The request to get user location timed out.'
                }
                error(timeoutError)
            })
        })

        // Click geolocation button
        cy.get('[data-cy="geolocation-button"]').click()

        // Wait for the geolocation process to complete
        cy.get('[data-cy="geolocation-button"]').should('not.have.class', 'p-button-loading')

        // Check that geolocation parameter is NOT added to URL
        getIframeDocument()
            .its('location.href')
            .should('not.match', /(?:\?|&)geolocation=true/)

        // Check if an error message is displayed
        cy.get('body').then(($body) => {
            if ($body.find('[data-cy="error-message"]').length > 0) {
                cy.get('[data-cy="error-message"]').should('be.visible')
                cy.get('[data-cy="error-message"]').should('contain.text', 'timeout')
            }
        })
    })

    it('handles geolocation position unavailable error', () => {
        cy.log('Test geolocation functionality when position is unavailable')

        // Mock geolocation to simulate position unavailable
        cy.window().then((win) => {
            cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((success, error) => {
                const unavailableError = {
                    code: 2, // POSITION_UNAVAILABLE
                    message: 'The network is down or the positioning satellites cannot be contacted.'
                }
                error(unavailableError)
            })
        })

        // Click geolocation button
        cy.get('[data-cy="geolocation-button"]').click()

        // Wait for the geolocation process to complete
        cy.get('[data-cy="geolocation-button"]').should('not.have.class', 'p-button-loading')

        // Check that geolocation parameter is NOT added to URL
        getIframeDocument()
            .its('location.href')
            .should('not.match', /(?:\?|&)geolocation=true/)

        // Check if an error message is displayed
        cy.get('body').then(($body) => {
            if ($body.find('[data-cy="error-message"]').length > 0) {
                cy.get('[data-cy="error-message"]').should('be.visible')
            }
        })
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

    it('handles geolocation permission denied on mobile', () => {
        cy.log('Test geolocation permission denied on mobile device')

        // Mock geolocation to simulate permission denied
        cy.window().then((win) => {
            cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((success, error) => {
                const permissionError = {
                    code: 1, // PERMISSION_DENIED
                    message: 'User denied the request for Geolocation.'
                }
                error(permissionError)
            })
        })

        // Click geolocation button
        cy.get('[data-cy="geolocation-button"]').click()

        // Wait for the geolocation process to complete
        cy.get('[data-cy="geolocation-button"]').should('not.have.class', 'p-button-loading')

        // Check that geolocation parameter is NOT added to URL
        getIframeDocument()
            .its('location.href')
            .should('not.match', /(?:\?|&)geolocation=true/)
    })
})
