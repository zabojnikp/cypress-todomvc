/// <reference types="Cypress" />
import MainPage from "./pageObjects/todo_page";

const page = new MainPage();

const ITEMS = {
  FIRST_TODO: "first todo",
  SECOND_TODO: "second todo",
  THIRD_TODO: "third todo"
};

describe("Todo - create, filter", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  context("Adding items", () => {
    it("should set page to inital state", () => {
      cy.get(page.pageTitle).should("have.text", "todos");
      cy.get(page.addNewItemInput).should("be.visible");
      cy.focused().should("have.attr", "placeholder", "What needs to be done?");
      cy.get(page.selectAllBtn).should("not.exist");
      cy.get(page.itemsList).should("not.exist");
      cy.get(page.footer).should("not.exist");
    });
    it("should add item with action controls and footer", () => {
      page.addItem(ITEMS.FIRST_TODO);

      cy.get(page.itemsList).should("have.length", 1);
      cy.get(page.itemCheckbox).should("not.be.selected");
      cy.get(page.itemLabel).should("have.text", ITEMS.FIRST_TODO);
      cy.get(page.itemDeleteBtn)
        .should("exist")
        .and("not.be.visible");
      cy.get(page.footer).should("exist");
    });

    it("should add multiple items, sorted them and show correct count for each item", () => {
      page.addItem(ITEMS.FIRST_TODO);

      cy.get(page.itemsList).should("have.length", 1);
      cy.get(page.itemsCount).should("have.text", "1 item left");
      cy.get(page.itemLabel).should("have.text", ITEMS.FIRST_TODO);

      page.addItem(ITEMS.SECOND_TODO);

      cy.get(page.itemsList).should("have.length", 2);
      cy.get(page.itemsCount).should("have.text", "2 items left");
      cy.get(page.itemLabel)
        .eq(1)
        .should("have.text", ITEMS.SECOND_TODO);

      page.addItem(ITEMS.THIRD_TODO);

      cy.get(page.itemsList).should("have.length", 3);
      cy.get(page.itemsCount).should("have.text", `3 items left`);
      cy.get(page.itemLabel)
        .eq(2)
        .should("have.text", ITEMS.THIRD_TODO);
    });
    it("should show empty value when item is added to the list", () => {
      page.addItem(ITEMS.FIRST_TODO);
      cy.get(page.addNewItemInput).should("have.attr", "value", "");
    });
  });
});
describe("Todo - edit, delete, complete, clear, mark ", () => {
  beforeEach(() => {
    cy.visit("/");
    page.addItem(ITEMS.FIRST_TODO);
    page.addItem(ITEMS.SECOND_TODO);
    page.addItem(ITEMS.THIRD_TODO);
    cy.get(page.itemsList).should("have.length", 3);
  });
  context("Editing items", () => {
    it("should edit items text", () => {
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
        .should("have.text", ITEMS.THIRD_TODO);
    });

    it("should hide item action controls during edit", () => {
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

    it("should save edit when clicked outside of editted text", () => {
      page.doubleClickItem(page.itemLabel, 2).as("secondItem");
      page.typeAndBlurText(`${ITEMS.THIRD_TODO} edit`);

      cy.get("@secondItem").should("have.text", `${ITEMS.THIRD_TODO} edit`);
    });
  });
  context("Deleting items", () => {
    it("should remove 1st item using with delete button", () => {
      page.deleteItem(0);

      cy.get(page.itemsList).should("have.length", 2);
      cy.get(page.itemsCount).should("have.text", "2 items left");
      cy.get(page.itemLabel)
        .eq(0)
        .should("have.text", ITEMS.SECOND_TODO);
      cy.get(page.itemLabel)
        .eq(1)
        .should("have.text", ITEMS.THIRD_TODO);
    });
    it("should remove 2nd item when empty text is entered", () => {
      page.editItem(page.itemLabel, 1, "{enter}");

      cy.get(page.itemsList).should("have.length", 2);
      cy.get(page.itemsCount).should("have.text", "2 items left");
      cy.get(page.itemLabel)
        .eq(0)
        .should("have.text", ITEMS.FIRST_TODO);
      cy.get(page.itemsList)
        .eq(1)
        .find(page.itemLabel)
        .should("have.text", ITEMS.THIRD_TODO);
    });
    it("should delete all items and show initial state", () => {
      page.deleteAllItems();

      cy.get(page.itemsList).should("not.exist");
      cy.get(page.footer).should("not.exist");
    });
  });
  context("Completed items", () => {
    it("should verify checked items have correct css styling", () => {
      cy.get(page.itemsList).each(($el, index) => {
        page.checkItem(index);

        cy.wrap($el)
          .find(page.itemLabel)
          .should("have.css", "text-decoration", "line-through solid rgb(217, 217, 217)");
      });
    });
    it("should check all items and verify all action controls are visible", () => {
      cy.get(page.itemsList).each(($el, index) => {
        cy.wrap($el).should("not.have.class", "completed");
        cy.wrap($el)
          .find(page.itemCheckbox)
          .should("not.be.checked");

        page.checkItem(index);

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
          .and("not.be.visible");
      });
    });
    it("should update footer counter when completed", () => {
      cy.get(page.itemCheckbox).each(($el, index, $list) => {
        if (index > 1) {
          cy.get(page.itemsCount).should("have.text", "1 item left");
        } else {
          cy.get(page.itemsCount).should("have.text", `${$list.length - index} items left`);
        }
        cy.wrap($el).check();
      });
      cy.get(page.itemsCount).should("have.text", "No items left");
    });
    it("should uncheck completed task", () => {
      page.checkAll();

      cy.get(page.itemsList).each(($el, index) => {
        page.uncheckItem(index);

        cy.wrap($el).should("not.have.class", "completed");
        cy.wrap($el)
          .find(page.itemCheckbox)
          .should("not.be.checked");
      });
      cy.get(page.itemsCount).should("have.text", "3 items left");
    });
  });
  context("Clear completed", () => {
    it("should display correct text", () => {
      page.checkAll();
      cy.get(page.clearCompletedBtn).should("have.text", "Clear completed");
    });

    it("should be visible only when there are items checked", () => {
      cy.get(page.clearCompletedBtn).should("not.exist");

      page.checkAll();

      cy.get(page.clearCompletedBtn)
        .should("exist")
        .and("be.visible");
    });
    it("should clear completed tasks", () => {
      const randomItem = Math.floor(Math.random() * 3);
      page.checkItem(randomItem);
      page.clearAllCompleted();

      cy.get(page.itemsList).should("have.length", 2);
      cy.get(page.itemsCount).should("have.text", "2 items left");

      page.checkAll();
      page.clearAllCompleted();

      cy.get(page.itemsList).should("not.exist");
      cy.get(page.footer).should("not.exist");
    });
  });
  context("Mark completed", () => {
    beforeEach(() => {
      page.selectAll();
    });
    it("should mark all tasks as completed", () => {
      cy.get(page.clearCompletedBtn).should("exist");
      cy.get(page.itemsList).should("have.length", 3);
      cy.get(page.itemsCount).should("have.text", "No items left");
      cy.get(page.itemsList).each($el => {
        cy.wrap($el).should("have.class", "completed");
        cy.wrap($el)
          .find(page.itemCheckbox)
          .should("be.checked");
      });
    });
    it("should un-mark all tasks as completed", () => {
      page.selectAll();

      cy.get(page.clearCompletedBtn).should("not.exist");
      cy.get(page.itemsList).should("have.length", 3);
      cy.get(page.itemsCount).should("have.text", "3 items left");
      cy.get(page.itemsList).each($el => {
        cy.wrap($el).should("not.have.class", "completed");
        cy.wrap($el)
          .find(page.itemCheckbox)
          .should("not.be.checked");
      });
    });
    it("user can delete completed task by button", () => {});
    it("user can delete completed task by doubleclick", () => {});
  });
});
