import TripCreation from '@/views/TripCreation.vue'

describe('<TripCreation />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(TripCreation)
  })

  it('displays map elements', () => {
    cy.visit('/') // Assuming this is your page URL
    // Assuming your map has a specific class or ID, replace '.map' with the correct selector
    cy.get('.map').should('exist')
    cy.get('.ol-map').should('exist') // Example: Assuming the map container has a class 'ol-map'
    cy.get('.info-panel').should('exist') // Example: Verifying the existence of the info panel
  })

  it('interacts with markers', () => {
    cy.visit('/') // Assuming this is your page URL

    // Assuming you have a marker and it's represented by a specific class or ID, replace '.marker' with the correct selector
    cy.get('.marker').should('have.length', 3) // Example: Assuming there are 3 markers initially

    // Example: Assuming there's an 'Add Marker' button and clicking it adds a new marker
    cy.contains('button', 'Add Marker').click()
    cy.get('.marker').should('have.length', 4) // Assuming it adds another marker
  })

  // Add more tests based on the functionalities and elements you want to verify
})
