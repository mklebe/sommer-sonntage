describe('Place tips for current sommer sonntag', () => {
  it('registers for the placing tips', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[placeholder="Benutzername"]')
      .type("Matze")
    
    cy.get('button')
      .click();

    cy.contains("Willkommen Matze")
  })
})