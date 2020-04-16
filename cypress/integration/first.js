describe('App', function() {
  it('loads the dashboard', function() {
    cy.login();
    cy.visit('/');
    cy.contains();
  });
});
