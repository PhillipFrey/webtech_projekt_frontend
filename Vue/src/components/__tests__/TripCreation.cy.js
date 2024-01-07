import TripCreation from '../../views/TripCreation.vue'

describe('<TripCreation />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(TripCreation)
  })
})