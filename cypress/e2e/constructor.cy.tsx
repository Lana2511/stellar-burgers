/// <reference types="cypress" />

// Константы для селекторов
const SELECTORS = {
  buns: '[data-cy=buns]',
  mains: '[data-cy=mains]',
  sauces: '[data-cy=sauces]',
  bunTop: '[data-cy=bun-1]',
  bunBottom: '[data-cy=bun-2]',
  ingredients: '[data-cy=ingredients]',
  modalOverlay: '[data-cy=modal-overlay]',
  orderButton: '[data-cy=make-order] button',
  orderDetails: '[data-cy=order-details]',
  modals: '#modals',
  modalCloseButton: '#modals button[aria-label="Закрыть"]'
};

describe('Конструктор: добавление ингредиентов', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
    cy.get(SELECTORS.buns).as('buns');
    cy.get(SELECTORS.mains).as('mains');
    cy.get(SELECTORS.sauces).as('sauces');
  });

  it('добавляет булку в конструктор', () => {
    cy.get('@buns').contains('Добавить').click();

    cy.get(SELECTORS.bunTop)
      .should('exist')
      .and('contain', 'Краторная булка N-200i (верх)');

    cy.get(SELECTORS.bunBottom)
      .should('exist')
      .and('contain', 'Краторная булка N-200i (низ)');
  });

  it('добавляет начинки и соусы', () => {
    cy.get('@mains').contains('Добавить').click();
    cy.get('@sauces').contains('Добавить').click();

    cy.get(SELECTORS.ingredients)
      .should('contain', 'Биокотлета из марсианской Магнолии')
      .and('contain', 'Соус Spicy-X');
  });
});

describe('Модальное окно: информация об ингредиенте', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
    cy.get(SELECTORS.modals).as('modals');
  });

  it('открывает модалку при клике на ингредиент', () => {
    cy.contains('Детали ингредиента').should('not.exist');
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('be.visible');
    cy.get('@modals').should('contain', 'Краторная булка N-200i');
  });

  it('закрывает модалку при нажатии на крестик', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.get('@modals').should('contain', 'Детали ингредиента');
    cy.get(SELECTORS.modalCloseButton).click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('закрывает модалку по клику на оверлей', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.get(SELECTORS.modalOverlay).click('right', { force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });
});

describe('Оформление заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('ingredients');
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('user');
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as('order');

    cy.setCookie('accessToken', 'test-accessToken');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refreshToken');
    });

    cy.visit('/');
    cy.wait('@ingredients');
    cy.wait('@user');

    // алиасы для повторного использования
    cy.get(SELECTORS.buns).as('buns');
    cy.get(SELECTORS.mains).as('mains');
    cy.get(SELECTORS.sauces).as('sauces');
    cy.get(SELECTORS.modals).as('modals');
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('успешно оформляет заказ', () => {
    cy.get('@buns').contains('Добавить').click();
    cy.get('@mains').contains('Добавить').click();
    cy.get('@sauces').contains('Добавить').click();

    cy.get(SELECTORS.orderButton).click();
    cy.wait('@order');

    cy.get('@modals').should('exist');
    cy.get(SELECTORS.orderDetails).should('contain', '12345');
    cy.get(SELECTORS.modalCloseButton).click();
    cy.get(SELECTORS.orderDetails).should('not.exist');
  });

  it('после перезагрузки конструктор пустой', () => {
    cy.get(SELECTORS.bunTop).should('not.exist');
    cy.get(SELECTORS.bunBottom).should('not.exist');
    cy.get(SELECTORS.ingredients).should('not.exist');
  });
});
