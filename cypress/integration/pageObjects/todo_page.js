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
  toggleAllBtn = "[data-cy='toggle-all-label']";
  filters = ".filters > li";

  addItem(itemText) {
    return cy.get(this.newItemInput).type(`${itemText}{enter}`);
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
  typeAndBlur(text) {
    return cy
      .get(this.itemEdit)
      .clear()
      .type(text)
      .blur();
  }
  checkItem(index) {
    return cy
      .get(this.itemCheckbox)
      .eq(index)
      .check();
  }
  uncheckItem(index) {
    return cy
      .get(this.itemCheckbox)
      .eq(index)
      .uncheck();
  }
  checkAll() {
    return cy.get(this.itemCheckbox).each($el => {
      cy.wrap($el).check();
    });
  }
  clearCompleted() {
    return cy.get(this.clearCompletedBtn).click();
  }
  selectAll() {
    return cy.get(this.toggleAllBtn).click({ force: true });
  }
  selectFilter(filterName) {
    return cy
      .get(this.filters)
      .contains(filterName)
      .click();
  }
}

export default MainPage;
