class MainPage {
  pageTitle = "[data-cy='title']";
  newItemInput = ".new-todo";
  itemsList = ".todo-list li";
  itemLabel = "[data-cy='todo-item-label']";
  itemCheckbox = ".toggle";
  itemDeleteBtn = ".destroy";
  itemEdit = ".edit";
  footer = ".footer";
  itemsCount = ".todo-count";
  clearCompletedBtn = ".clear-completed";
  selectAllBtn = "[data-cy='toggle-all-label']";
  filters = ".filters > li";

  addItem(itemText) {
    cy.get(this.newItemInput).type(`${itemText}{enter}`);
  }

  deleteItem(index) {
    cy.get(this.itemDeleteBtn)
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
    cy.get(this.itemEdit)
      .clear()
      .type(text);
  }
  deleteAllItems() {
    cy.get(this.itemDeleteBtn).each($el => {
      cy.wrap($el).click({ force: true });
    });
  }
  typeAndBlurText(text) {
    cy.get(this.itemEdit)
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
  clearCompleted() {
    cy.get(this.clearCompletedBtn).click();
  }
  selectAll() {
    cy.get(this.selectAllBtn).click({ force: true });
  }
  selectFilter(filterName) {
    cy.get(this.filters)
      .contains(filterName)
      .click();
  }
}

export default MainPage;
