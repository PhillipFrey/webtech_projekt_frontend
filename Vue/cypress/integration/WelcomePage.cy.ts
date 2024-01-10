import { describe, it } from 'vitest'



describe('Creat a Trip in WelcomePage file', () => {
  it('checks whether the border color of the input field turns red as expected when the form is submitted without any input.', () => {
    cy.visit('http://localhost:5173/')

    // Triggering form submission without entering any text
    cy.get('form').submit()

    // Verifying that the field has an error indication after form submission
    cy.get('#tripName').should('have.css', 'border-color', 'rgb(255, 0, 0)') // Example assuming the border turns red on error
  });
});

describe('WelcomePage Funktionalität', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/') // Besuche die WelcomePage vor jedem Test
  })

  it('Überprüft die Sichtbarkeit des Trip-Planner-Titels', () => {
    cy.get('h1').should('contain', 'Welcome to our Trip Planner!')
  })

  it('Bestätigt die Existenz der Beschreibung für den Trip-Planner', () => {
    cy.get('.description-box .description').should('be.visible')
  })

  it('Validiert das Absenden des Formulars für die Triperstellung', () => {
    // Simuliere das Absenden des Formulars ohne Eingabe eines Trip-Namens
    cy.get('form').submit()

    // Überprüfe, ob eine Fehlermeldung angezeigt wird
    cy.get('.error-message').should('be.visible').and('contain', 'Please provide a name to create a trip')
  })

  // Hier können weitere Tests hinzugefügt werden, um andere Funktionalitäten deiner WelcomePage zu überprüfen
})

