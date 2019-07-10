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
  context.skip("Initial state", () => {
    it("page is set to inital state", () => {
      cy.get(page.pageTitle).should("have.text", "todos");
      cy.get(page.addNewItemInput).should("be.visible");
      cy.focused().should("have.attr", "placeholder", "What needs to be done?");
      cy.get(page.itemsList).should("not.exist");
      cy.get(page.footer).should("not.exist");
    });
  });
  context.skip("Adding items", () => {
    it("item is added with action controls and footer exists", () => {
      page.addItem(ITEM_ONE);

      cy.get(page.itemsList).should("have.length", 1);
      cy.get(page.itemCheckbox).should("not.be.selected");
      cy.get(page.itemLabel).should("have.text", ITEM_ONE);
      cy.get(page.itemDeleteBtn)
        .should("exist")
        .should("not.be.visible");
      cy.get(page.footer).should("exist");
    });

    it("multiple items are added, sorted and correct count is shown for each item add", () => {
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
  context.skip("Editing items", () => {
    beforeEach(() => {
      page.addItem(ITEM_ONE);
      page.addItem(ITEM_TWO);
      page.addItem(ITEM_THREE);
      cy.get(page.itemsList).should("have.length", 3);
    });
    it("User is able to edit items text", () => {
      page.editItem(page.itemLabel, 0, "edit1 {enter}");
      page.editItem(page.itemLabel, 1, "edit2 {enter}");

      cy.get(page.itemLabel)
        .eq(0)
        .should("have.text", "edit1");
      cy.get(page.itemLabel)
        .eq(1)
        .should("have.text", "edit2");
      cy.get(page.itemLabel)
        .eq(2)
        .should("have.text", ITEM_THREE);
    });

    it("Item action controls are hidden during edit", () => {
      page.doubleClickItem(page.itemLabel, 0).as("firstTodo");

      cy.get(page.itemCheckbox).should("have.length", 2);
      cy.get(page.itemDeleteBtn).should("have.length", 2);

      cy.get("@firstTodo")
        .find(page.itemCheckbox)
        .should("not.exist");

      cy.get("@firstTodo")
        .find(page.itemDeleteBtn)
        .should("not.exist");
    });

    it("Edit is saved when clicked outside of edit field", () => {
      page.doubleClickItem(page.itemLabel, 2).as("secondItem");
      page.typeAndBlurText(`${ITEM_THREE} edit`);

      cy.get("@secondItem").should("have.text", `${ITEM_THREE} edit`);
    });
  });
  context.skip("Deleting items", () => {
    beforeEach(() => {
      page.addItem(ITEM_ONE);
      page.addItem(ITEM_TWO);
      page.addItem(ITEM_THREE);
      cy.get(page.itemsList).should("have.length", 3);
    });
    it("1st item is removed from the list with delete button", () => {
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
      page.editItem(page.itemLabel, 1, "{enter}");

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
      page.deleteAllItems();
      cy.get(page.itemsList).should("not.exist");
      cy.get(page.footer).should("not.exist");
    });
  });
  context("Completed items", () => {
    beforeEach(() => {
      page.addItem(ITEM_ONE);
      page.addItem(ITEM_TWO);
      page.addItem(ITEM_THREE);
      cy.get(page.itemsList).should("have.length", 3);
    });
    it("checked item should get completed class assigned and counter updated", () => {
      page.checkCheckbox(0);

      cy.get(page.itemsList)
        .eq(0)
        .find(page.itemCheckbox)
        .should("be.checked");
      cy.get(page.itemsList)
        .eq(0)
        .should("have.class", "completed");

      cy.get(page.itemsList)
        .eq(1)
        .find(page.itemCheckbox)
        .should("not.be.checked");
      cy.get(page.itemsList)
        .eq(1)
        .should("not.have.class", "completed");

      cy.get(page.itemsCount).should("have.text", "2 items left");
    });
    it("checked item label should have correct css styling", () => {
      page.checkCheckbox(1);
      cy.get(page.itemLabel)
        .eq(1)
        .should("have.css", "text-decoration", "line-through solid rgb(217, 217, 217)");
    });
    it("all check items should have same action controls and counter updated", () => {
      page.checkAll();

      cy.get(page.itemsList).each($el => {
        cy.wrap($el).should("have.class", "completed");
        cy.wrap($el)
          .find(page.itemCheckbox)
          .should("be.checked");
        cy.wrap($el)
          .find(page.itemLabel)
          .should("be.visible");
        cy.wrap($el)
          .find(page.itemDeleteBtn)
          .should("exist")
          .should("not.be.visible");
      });
      cy.get(page.itemsCount).should("have.text", "No items left");
    });
    it.skip("user can un-check completed task", () => {});
    it.skip("user can delete completed task", () => {});
    it.skip("user can clear completed task", () => {});
    it.skip("user can mark all tasks as completed at once", () => {});
  });
});
