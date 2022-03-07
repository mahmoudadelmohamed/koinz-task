/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('example to-do app', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
    })
  
    it('can add tasks', () => {
      cy.findByTestId('droppable-0').children().should('have.length', 0);
      cy.findByTestId('add-task-btn').click();
      cy.findByTestId('value-input').focus().type('Task #1');
      cy.findByTestId('form-submit').click();
      cy.findByTestId('edit-popup').children().last().click();
      cy.findByTestId('droppable-0').children().should('have.length', 1);
    });
  
  })
  