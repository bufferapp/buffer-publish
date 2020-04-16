describe('App', function() {
  it('creates a new post', function() {
    cy.login();
    cy.visit('/');
    cy.get('[data-cy=open-composer-button]').click();
    cy.get('[data-cy=composer-text-zone').type(
      'This is my first post!{cmd}{enter}'
    );
    cy.get('[data-cy=post]').should('contain', 'This is my first post!');
  });
});
