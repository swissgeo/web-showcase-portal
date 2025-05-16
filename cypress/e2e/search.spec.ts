describe('Test the search on desktop', () => {
    beforeEach(() => {
        cy.viewport('macbook-15')
        cy.visit('/')
        cy.get('[data-cy="button-overlay-confirm"]').click()
    })
    it('Search yields a result', () => {
        cy.get('[data-cy="comp-search-desktop"]').should('exist').should('be.visible')
        cy.get('[data-cy="comp-search-mobile"]').should('not.exist')
        cy.intercept(
            'https://www.geocat.ch/geonetwork/srv/api/search/records/_search?bucket=bucket',
            {
                fixture: 'geocat-wald-search-result.json',
            }
        )
        cy.get('[data-cy="input-search"]').type('wald')
        cy.get('[data-cy="ul-geocat-search-results"]').find('li').should('have.length', 10)
    })
})

describe('Test the search on mobile', () => {
    beforeEach(() => {
        cy.viewport('iphone-se2')
        cy.visit('/')
        cy.get('[data-cy="button-overlay-confirm"]').click()
    })
    it('Search yields a result', () => {
        cy.get('[data-cy="comp-search-mobile"]').should('exist').should('be.visible')
        cy.get('[data-cy="comp-search-desktop"]').should('not.exist')
        cy.intercept(
            'https://www.geocat.ch/geonetwork/srv/api/search/records/_search?bucket=bucket',
            {
                fixture: 'geocat-wald-search-result.json',
            }
        ).as('geoCatWaldResults')

        cy.get('[data-cy="input-search"]').type('wald')
        // open accordion
        cy.get('[data-cy="comp-data-accordion"]').click()

        cy.get('[data-cy="ul-geocat-search-results"]').find('li').as('searchResults')

        // we get the last element in the list, which initially isn't visible
        cy.get('[data-cy="ul-geocat-search-results"]')
            .find('li:nth-child(10)')
            .as('lastSearchResult')

        cy.get('@searchResults').should('have.length', 10)

        cy.log('Make sure the result list is scrollable')
        // the list is too long. the last result isn't visible
        cy.get('@lastSearchResult').should('not.be.visible')
        cy.get('@lastSearchResult').scrollIntoView()

        // now after scrolling it is visible (beware: scrolling loads more items)
        cy.get('@lastSearchResult').should('be.visible')
        // first one is scrolled out of view
        cy.get('@searchResults').first().should('not.be.visible')
        cy.get('@searchResults').should('have.length', 20)
    })
})
