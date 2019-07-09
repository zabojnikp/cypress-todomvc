/// <reference types="Cypress" />
import MainPage from "./pageObjects/todo_page";

const page = new MainPage();

describe("TodoMVC", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });
  it("page should be set to inital state", () => {
    cy.get(page.pageTitle).should("have.text", "todos");
    cy.get(page.addNewItemInput).should("be.visible");
    cy.focused().should("have.attr", "placeholder", "What needs to be done?");
    cy.get(page.itemsList).should("not.exist");
    cy.get(page.footer).should("not.exist");
  });

  it("should add item to the list", () => {
    cy.get(page.addNewItemInput).type("first todo{enter}");
    cy.get(page.itemsList).should("have.length", 1);
    cy.get(page.itemCheckbox).should("not.be.selected");
    cy.get(page.itemLabel).should("have.text", "first todo");
    cy.get(page.itemDeleteBtn).should("not.be.visible");
  });

  it("should add multiple items to the list", () => {
    cy.get(page.addNewItemInput).type("first todo{enter}");
    cy.get(page.addNewItemInput).type("second todo{enter}");
    cy.get(page.addNewItemInput).type("third todo{enter}");
    cy.get(page.addNewItemInput).type("fourth todo{enter}");
    cy.get(page.itemsList).should("have.length", 4);
  });
  it("should delete added item", () => {
    // add test
  });
});
