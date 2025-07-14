describe('Test the search on desktop', () => {
    beforeEach(() => {
        cy.viewport('macbook-15')
        cy.visit('/')
        cy.dismissWelcomeOverlay()
    })
    it('Search yields a result', () => {
        // Open the search sidebar
        cy.get('[data-cy="button-search-panel"]').should('exist').should('be.visible')
        cy.get('[data-cy="div-search-sidebar"]').should('exist').should('be.visible')
        cy.get('[data-cy="comp-search-mobile"]').should('not.exist')

        // Type search term in the sidebar search input
        cy.get('[data-cy="input-search"]').type('bern')

        // open geocat accordion
        cy.get('[data-cy="comp-data-accordion"]').click()

        // At first we only get 20 results
        cy.get('[data-cy="ul-geocat-search-results"]').find('li').as('geocatSearchResults')
        cy.get('@geocatSearchResults').should('have.length', 20)

        // Full load of the search results after scrolling
        cy.log('Make sure the result list is scrollable')
        cy.get('[data-cy="div-geocat-search-results"]').scrollTo('bottom', { duration: 500 })
        cy.get('[data-cy="ul-geocat-search-results"]').find('li').as('geocatSearchResults')
        cy.get('@geocatSearchResults').should('have.length', 40)

        // Scroll to the bottom to find the address results accordion
        cy.get('[data-cy="div-search-sidebar"]').scrollTo('bottom', { duration: 500 })

        // open address accordion and test if it works
        cy.get('[data-cy="comp-address-accordion"]').click()
        cy.get('[data-cy="ul-address-search-results"]').find('li').as('addressSearchResults')
        cy.get("@addressSearchResults").should('have.length', 20)
    })
})

describe('Test the search on mobile', () => {
    beforeEach(() => {
        cy.viewport('iphone-se2')
        cy.visit('/')
        cy.dismissWelcomeOverlay()
    })
    it('Search yields a result', () => {
        cy.get('[data-cy="comp-search-mobile"]').should('exist').should('be.visible')
        cy.get('[data-cy="div-search-desktop"]').should('not.exist')

        cy.get('[data-cy="input-search"]').type('bern')
        // open accordion
        cy.get('[data-cy="comp-data-accordion"]').click()

        cy.get('[data-cy="ul-geocat-search-results"]').find('li').as('geocatSearchResults')

        // we get the last element in the list, which initially isn't visible
        cy.get('[data-cy="ul-geocat-search-results"]')
            .find('li:nth-child(10)')
            .as('tenthSearchResult')

        cy.get('@geocatSearchResults').should('have.length', 20)

        cy.log('Make sure the result list is scrollable')
        // the list is too long. the last result isn't visible
        cy.get('@tenthSearchResult').should('not.be.visible')
        cy.get('[data-cy="div-geocat-search-results"]').realMouseWheel({ deltaY: 300 })
        // cy.get('[data-cy="comp-search-results-mobile"]').realMouseWheel({ deltaY: 300 })


        // now after scrolling it is visible (beware: scrolling loads more items)
        cy.get('@tenthSearchResult').should('be.visible')
        // first one is scrolled out of view
        cy.get('@geocatSearchResults').first().should('not.be.visible')

        cy.get('[data-cy="div-geocat-search-results"]').scrollTo('bottom', { duration: 500 })
        // cy.get('[data-cy="comp-search-results-mobile"]').scrollTo('bottom', { duration: 500 })

        //open address accordion and test if it works
        cy.get('[data-cy="comp-address-accordion"]').click()


        cy.get('[data-cy="ul-address-search-results"]').find('li').as('addressSearchResults').should('have.length', 20)

        //now re-open data accordion to fully load the data
        cy.get('[data-cy="comp-data-accordion"]').click()
        cy.get('@geocatSearchResults').should('have.length', 40)
    })
})
