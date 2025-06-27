/// <reference types="cypress" />

describe('Конструктор: добавление ингредиентов', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
      cy.visit('http://localhost:4000');
    });
  
    it('добавляет булку в конструктор', () => {
      cy.get('[data-cy=buns]').contains('Добавить').click();
  
      cy.get('[data-cy=bun-1]')
        .should('exist')
        .and('contain', 'Краторная булка N-200i (верх)');
  
      cy.get('[data-cy=bun-2]')
        .should('exist')
        .and('contain', 'Краторная булка N-200i (низ)');
    });
  
    it('добавляет начинки и соусы', () => {
      cy.get('[data-cy=mains]').contains('Добавить').click();
      cy.get('[data-cy=sauces]').contains('Добавить').click();
  
      cy.get('[data-cy=ingredients]')
        .should('contain', 'Биокотлета из марсианской Магнолии')
        .and('contain', 'Соус Spicy-X');
    });
  });
  
  describe('Модальное окно: информация об ингредиенте', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
      cy.visit('http://localhost:4000');
    });
  
    it('открывает модалку при клике на ингредиент', () => {
      cy.contains('Детали ингредиента').should('not.exist');
      cy.contains('Краторная булка N-200i').click();
      cy.contains('Детали ингредиента').should('be.visible');
      cy.get('#modals').should('contain', 'Краторная булка N-200i');
    });
  
    it('закрывает модалку при нажатии на крестик', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('#modals').should('contain', 'Детали ингредиента');
      cy.get('#modals button[aria-label="Закрыть"]').click();
      cy.contains('Детали ингредиента').should('not.exist');
    });
  
    it('закрывает модалку по клику на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-cy=modal-overlay]').click('right', { force: true });
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
  
      cy.visit('http://localhost:4000');
      cy.wait('@ingredients');
      cy.wait('@user');
    });
  
    afterEach(() => {
      cy.clearLocalStorage();
    });
  
    it('успешно оформляет заказ', () => {
      cy.get('[data-cy=buns]').contains('Добавить').click();
      cy.get('[data-cy=mains]').contains('Добавить').click();
      cy.get('[data-cy=sauces]').contains('Добавить').click();
      cy.get('[data-cy=make-order] button').click();
  
      cy.wait('@order')

      cy.get('#modals').should('exist');
  
      cy.get('[data-cy=order-details]').should('contain', '12345');
      cy.get('#modals button[aria-label="Закрыть"]').click();
      cy.get('[data-cy=order-details]').should('not.exist');
    });
  
    it('после перезагрузки конструктор пустой', () => {
      cy.get('[data-cy=bun-1]').should('not.exist');
      cy.get('[data-cy=bun-2]').should('not.exist');
      cy.get('[data-cy=ingredients]').should('not.exist');
    });
  });