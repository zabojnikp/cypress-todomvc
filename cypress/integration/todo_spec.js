/// <reference types="Cypress" />
import MainPage from "./pageObjects/todo_page";

const page = new MainPage();

const ITEM_ONE = "first todo";
const ITEM_TWO = "second todo";
const ITEM_THREE = "third todo";

describe("TodoMVC", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  context("Initial state", () => {
    it("page is set to inital state", () => {
      cy.get(page.pageTitle).should("have.text", "todos");
      cy.get(page.addNewItemInput).should("be.visible");
      cy.focused().should("have.attr", "placeholder", "What needs to be done?");
      cy.get(page.itemsList).should("not.exist");
      cy.get(page.footer).should("not.exist");
    });
  });
  context("Adding items", () => {
    it("item is added with action elements and footer exists", () => {
      page.addItem(ITEM_ONE);

      cy.get(page.itemsList).should("have.length", 1);
      cy.get(page.itemCheckbox).should("not.be.selected");
      cy.get(page.itemLabel).should("have.text", ITEM_ONE);
      cy.get(page.itemDeleteBtn).should("exist");
      cy.get(page.itemDeleteBtn).should("not.be.visible");
      cy.get(page.footer).should("exist");
    });

    it("multiple items are added, sorted and correct count is shown for each", () => {
      page.addItem(ITEM_ONE);

      cy.get(page.itemsList).should("have.length", 1);
      cy.get(page.itemsCount).should("have.text", "1 item left");
      cy.get(page.itemLabel).should("have.text", ITEM_ONE);

      page.addItem(ITEM_TWO);

      cy.get(page.itemsList).should("have.length", 2);
      cy.get(page.itemsCount).should("have.text", "2 items left");
      cy.get(page.itemLabel)
        .eq(1)
        .should("have.text", ITEM_TWO);

      page.addItem(ITEM_THREE);

      cy.get(page.itemsList).should("have.length", 3);
      cy.get(page.itemsCount).should("have.text", "3 items left");
      cy.get(page.itemLabel)
        .eq(2)
        .should("have.text", ITEM_THREE);
    });
    it("input value is empty when item is added to the list", () => {
      page.addItem(ITEM_ONE);
      cy.get(page.addNewItemInput).should("have.attr", "value", "");
    });
  });
  context("Deleting items", () => {
    beforeEach(() => {
      page.addItem(ITEM_ONE);
      page.addItem(ITEM_TWO);
      page.addItem(ITEM_THREE);
      cy.get(page.itemsList).should("have.length", 3);
    });
    it("1st item is removed from the list", () => {
      page.deleteItem(0);

      cy.get(page.itemsList).should("have.length", 2);
      cy.get(page.itemsCount).should("have.text", "2 items left");
      cy.get(page.itemLabel)
        .eq(0)
        .should("have.text", ITEM_TWO);
      cy.get(page.itemLabel)
        .eq(1)
        .should("have.text", ITEM_THREE);
    });
    it("2nd item is removed when empty text is entered", () => {
      page.editItem(1, "");

      cy.get(page.itemsList).should("have.length", 2);
      cy.get(page.itemsCount).should("have.text", "2 items left");
      cy.get(page.itemLabel)
        .eq(0)
        .should("have.text", ITEM_ONE);
      cy.get(page.itemsList)
        .eq(1)
        .find(page.itemLabel)
        .should("have.text", ITEM_THREE);
    });
    it("when all items are deleted initial state is shown", () => {
      cy.get(page.itemDeleteBtn).should("have.length", 3);

      page.deleteAllItems();
      cy.get(page.itemsList).should("not.exist");
      cy.get(page.footer).should("not.exist");
    });
  });
});
