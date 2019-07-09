class MainPage {
  // locators
  pageTitle = "[data-cy='title']";
  addNewItemInput = ".new-todo";
  itemsList = ".todo-list li";
  itemLabel = "[data-cy='todo-item-label']";
  itemCheckbox = ".toggle";
  itemDeleteBtn = ".destroy";
  itemEdit = ".edit";
  footer = ".footer";
  itemsCount = ".todo-count";

  addItem(itemText) {
    cy.get(this.addNewItemInput).type(`${itemText}{enter}`);
  }

  deleteItem(index) {
    cy.get(this.itemDeleteBtn)
      .eq(index)
      .click({ force: true });
  }
  editItem(index, text) {
    cy.get(this.itemLabel)
      .eq(index)
      .dblclick();
    cy.get(this.itemEdit)
      .clear()
      .type(`${text}{enter}`);
  }
}

export default MainPage;
