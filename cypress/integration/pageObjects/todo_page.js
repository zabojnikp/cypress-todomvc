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
  clearCompletedBtn = ".clear-completed";
  selectAllBtn = "[data-cy='toggle-all-label']";

  addItem(itemText) {
    return cy.get(this.addNewItemInput).type(`${itemText}{enter}`);
  }

  deleteItem(index) {
    return cy
      .get(this.itemDeleteBtn)
      .eq(index)
      .click({ force: true });
  }

  doubleClickItem(item, index) {
    return cy
      .get(item)
      .eq(index)
      .dblclick();
  }
  editItem(item, index, text) {
    this.doubleClickItem(item, index);
    return cy
      .get(this.itemEdit)
      .clear()
      .type(text);
  }
  deleteAllItems() {
    return cy.get(this.itemDeleteBtn).each($el => {
      cy.wrap($el).click({ force: true });
    });
  }
  typeAndBlurText(text) {
    return cy
      .get(this.itemEdit)
      .clear()
      .type(text)
      .blur();
  }
  checkItem(index) {
    cy.get(this.itemCheckbox)
      .eq(index)
      .check();
  }
  uncheckItem(index) {
    cy.get(this.itemCheckbox)
      .eq(index)
      .uncheck();
  }
  checkAll() {
    cy.get(this.itemCheckbox).each($el => {
      cy.wrap($el).check();
    });
  }
  clearAllCompleted() {
    cy.get(this.clearCompletedBtn).click();
  }
  selectAll() {
    cy.get(this.selectAllBtn).click({ force: true });
  }
}

export default MainPage;
