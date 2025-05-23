describe('Test the search on desktop', () => {
    beforeEach(() => {
        cy.viewport('macbook-15')
        cy.visit('/')
        // cy.get('[data-cy="button-overlay-confirm"]').click()
    })
    it('Search yields a result', () => {
        cy.get('[data-cy="div-search-desktop"]').should('exist').should('be.visible')
        cy.get('[data-cy="comp-search-mobile"]').should('not.exist')
        cy.get('[data-cy="input-search"]').realClick().realType('wald')
        cy.get('[data-cy="ul-geocat-search-results"]').find('li').as('searchResults')
        cy.get('@searchResults').should('have.length', 20)

        cy.get('[data-cy="ul-geocat-search-results"]')
            .find('li:nth-child(10)')
            .as('tenthSearchResult')

        // on desktop we already see all 10 entries
        cy.get('@tenthSearchResult').should('be.visible')

        // we need to scroll in two steps: one that updates the "canLoadMore" of the infinite scroll
        // then another one that gets to the bottom, which then triggers the loading
        // probably this is needed because otherwise the cypress scroll isn't really mimicking
        // a "real" scrolling
        cy.get('[data-cy="div-geocat-search-results"]').realMouseWheel({ deltaY: 20 })
        cy.get('[data-cy="div-geocat-search-results"]').realMouseWheel({ deltaY: 500 })

        cy.get('@searchResults').should('have.length', 40)
    })
})

describe('Test the search on mobile', () => {
    beforeEach(() => {
        cy.viewport('iphone-se2')
        cy.visit('/')
        // cy.get('[data-cy="button-overlay-confirm"]').click()
    })
    it('Search yields a result', () => {
        cy.get('[data-cy="comp-search-mobile"]').should('exist').should('be.visible')
        cy.get('[data-cy="div-search-desktop"]').should('not.exist')

        cy.get('[data-cy="input-search"]').type('wald')
        // open accordion
        cy.get('[data-cy="comp-data-accordion"]').click()

        cy.get('[data-cy="ul-geocat-search-results"]').find('li').as('searchResults')

        // we get the last element in the list, which initially isn't visible
        cy.get('[data-cy="ul-geocat-search-results"]')
            .find('li:nth-child(10)')
            .as('tenthSearchResult')

        cy.get('@searchResults').should('have.length', 20)

        cy.log('Make sure the result list is scrollable')
        // the list is too long. the last result isn't visible
        cy.get('@tenthSearchResult').should('not.be.visible')
        // cy.get('@tenthSearchResult').scrollIntoView()
        // cy.pause()
        cy.get('[data-cy="comp-data-accordion-content"]').realMouseWheel({ deltaY: 300 })

        // now after scrolling it is visible (beware: scrolling loads more items)
        cy.get('@tenthSearchResult').should('be.visible')
        // first one is scrolled out of view
        cy.get('@searchResults').first().should('not.be.visible')

        // lets scroll some more, this loads more data
        cy.get('[data-cy="comp-data-accordion-content"]').realMouseWheel({ deltaY: 500 })
        cy.get('@searchResults').should('have.length', 40)
    })
})
