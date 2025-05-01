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
        cy.get('[data-cy="ul-search-results"]').find('li').should('have.length', 10)
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
        )

        cy.get('[data-cy="input-search"]').type('wald')
        cy.get('[data-cy="ul-search-results"]').find('li').as('searchResults')
        cy.get('@searchResults').should('have.length', 10)

        cy.log('Make sure the result list is scrollable')
        // the list is too long. the last result isn't visible
        cy.get('@searchResults').last().should('not.be.visible')
        cy.get('@searchResults').last().scrollIntoView()
        cy.get('@searchResults').last().should('be.visible')
        cy.get('@searchResults').first().should('not.be.visible')
    })
})
