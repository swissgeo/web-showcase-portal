// from https://www.cypress.io/blog/working-with-iframes-in-cypress
const getIframeDocument = () => {
    return cy.get('[data-cy="iframe-mapviewer"]').its('0.contentDocument').should('exist')
}

const getIframeBody = () => {
    // get the document
    return getIframeDocument().its('body').should('not.be.undefined').then(cy.wrap)
}

describe('Test the map on desktop', () => {
    beforeEach(() => {
        cy.viewport('iphone-se2')
        cy.visit('/')
        cy.get('[data-cy="button-overlay-confirm"]').click()
    })
    it('renders the map', () => {
        cy.log('Test if the map renders and can be zoomed in and out')

        cy.get('[data-cy="iframe-mapviewer"]').should('exist')
        getIframeBody().find('[data-cy="zoom-in"]').should('exist').click().click()
        getIframeDocument()
            .its('location.href')
            .should('match', /(?:\?|&)z=3/)

        getIframeBody().find('[data-cy="zoom-out"]').should('exist').click()
        getIframeDocument()
            .its('location.href')
            .should('match', /(?:\?|&)z=2/)
    })
    it('loads a search result on the map', () => {
        cy.intercept(
            'https://www.geocat.ch/geonetwork/srv/api/search/records/_search?bucket=bucket',
            {
                fixture: 'geocat-wald-search-result.json',
            }
        )
        cy.get('[data-cy="input-search"]').type('wald')
        cy.log(
            'adding the layer "swissTLM3D Wald" to the map and checking that a tile is request (that it was correctly loaded)'
        )
        cy.get('[data-cy="add-result-cdb289d5-db16-4440-8529-5807a262f6a2"]').click()
        getIframeDocument().its('location.href').should(
            'contain',
            // %7C == | encoded for URLs
            'WMS%7Chttps://wms.geo.admin.ch%7Cch.swisstopo.swisstlm3d-wald'
        )
    })
})

describe('Test the map on mobile', () => {
    beforeEach(() => {
        cy.viewport('macbook-15')
        cy.visit('/')
        cy.get('[data-cy="button-overlay-confirm"]').click()
    })
    it('renders the map', () => {
        cy.log('Test if the map renders and can be zoomed in and out')

        cy.get('[data-cy="iframe-mapviewer"]').should('exist')
        getIframeBody().find('[data-cy="zoom-in"]').should('exist').click().click()
        getIframeDocument()
            .its('location.href')
            .should('match', /(?:\?|&)z=3/)

        getIframeBody().find('[data-cy="zoom-out"]').should('exist').click()
        getIframeDocument()
            .its('location.href')
            .should('match', /(?:\?|&)z=2/)
    })
})
