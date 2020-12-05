describe('Counter', function() {
  it('increments and decrements', function() {
    cy.visit('./cypress/fixtures/counter.html');

    cy.get('[data-ix-click="add"]').eq(0).click().click().click();
    cy.get('[data-ix-click="subtract"]').eq(1).click().click();
    cy.get('[data-ix-click="add"]').eq(2).click();
    cy.get('[data-ix-component="counter"] strong').should(($el) => {
      expect($el.eq(0)).to.contain('3');
      expect($el.eq(1)).to.contain('-2');
      expect($el.eq(2)).to.contain('1');
    });
  });
});
