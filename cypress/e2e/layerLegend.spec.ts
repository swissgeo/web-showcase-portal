describe('Layer Legend on desktop', () => {
    beforeEach(() => {
        cy.viewport('macbook-15')
        cy.visit('/')
        // cy.get('[data-cy="button-overlay-confirm"]').click()
    })

    it('Can open and close the layer legend on Desktop', () => {
        cy.get('[data-cy="div-layer-legend"]').should('not.exist')
        cy.get('[data-cy="comp-layer-legend-button"]').should('be.visible').click()
        cy.get('[data-cy="div-layer-legend"]').should('be.visible')
        cy.get('[data-cy="comp-layer-legend-button"]').should('not.be.visible')
        cy.get('[data-cy="comp-layer-legend-close"]').should('be.visible').click()
        cy.get('[data-cy="div-layer-legend"]').should('not.exist')
    })
})

describe('Layer Legend on mobile', () => {
    beforeEach(() => {
        cy.viewport('iphone-se2')
        cy.visit('/')
        // cy.get('[data-cy="button-overlay-confirm"]').click()
    })

    it('Can open and close the layer legend on Mobile', () => {
        cy.get('[data-cy="div-layer-legend"]').should('not.exist')
        cy.get('[data-cy="comp-layer-legend-button"]').should('be.visible').click()
        cy.get('[data-cy="div-layer-legend"]').should('be.visible')
        cy.get('[data-cy="comp-layer-legend-close"]').should('be.visible').click()
        cy.get('[data-cy="div-layer-legend"]').should('not.exist')
    })
})
