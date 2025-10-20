describe('Burger Constructor', () => {
  beforeEach(() => {
    // Перехватываем все API запросы
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');
    
    // Устанавливаем фейковые токены
    cy.setCookie('accessToken', 'fake-access-token');
    window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.contains('Соберите бургер').should('be.visible');
  });

  afterEach(() => {
    // Очищаем токены после тестов
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  describe('Функциональность ингредиентов', () => {
    it('должен отображать список ингредиентов', () => {      
      cy.get('[data-testid="ingredient-bun"]').should('exist');
      cy.get('[data-testid="ingredient-main"]').should('exist');
      cy.get('[data-testid="ingredient-sauce"]').should('exist');
    });
    
    it('должен добавить булочку в конструктор', () => {
      cy.get('[data-testid="ingredient-bun"]').first().within(() => {
        cy.get('.common_button').contains('Добавить').click();
      });
      cy.get('[data-testid="constructor-bun-top"]').should('exist');
      cy.get('[data-testid="constructor-bun-bottom"]').should('exist');
      cy.get('[data-testid="no-bun-top"]').should('not.exist');
      cy.get('[data-testid="no-bun-bottom"]').should('not.exist');
    });

    it('должен добавить ингредиент в конструктор', () => {
      cy.get('[data-testid="ingredient-main"]').first().within(() => {
        cy.get('.common_button').contains('Добавить').click();
      });      
      cy.get('[data-testid="constructor-ingredient"]').should('exist');
      cy.get('[data-testid="no-ingredients"]').should('not.exist');
    });

    it('должен добавить соус в конструктор', () => {
      cy.get('[data-testid="ingredient-sauce"]').first().within(() => {
        cy.get('.common_button').contains('Добавить').click();
      });      
      cy.get('[data-testid="constructor-ingredient"]').should('exist');
      cy.get('[data-testid="no-ingredients"]').should('not.exist');
    });
    
    it('должен правильно рассчитать общую стоимость', () => {
      cy.get('[data-testid="ingredient-bun"]').first().within(() => {
        cy.get('.common_button').contains('Добавить').click();
      });
      cy.get('[data-testid="ingredient-main"]').first().within(() => {
        cy.get('.common_button').contains('Добавить').click();
      });        
      cy.get('[data-testid="total-price"]').should('not.contain', '0');
      cy.get('[data-testid="order-button"]').should('not.be.disabled');
    });
  });

  describe('Модальные окна', () => {
    it('должен открывать и закрывать модальное окно ингредиента', () => {
      cy.get('[data-testid=ingredient-main]').first().click();
      
      cy.get('[data-testid=modal]').should('exist');
      cy.contains('Детали ингредиента').should('exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      
      cy.get('[data-testid=modal-close-button]').click();
      cy.get('[data-testid=modal]').should('not.exist');
    });

    it('должен закрыть модальное окно щелчком мыши по оверлею', () => {
      cy.get('[data-testid=ingredient-main]').first().click();
      
      cy.get('[data-testid=modal]').should('exist');

      cy.get('[data-testid=modal-overlay]').click({ force: true });
      cy.get('[data-testid=modal]').should('not.exist');
    });

    it('должны отображать правильные данные об ингредиентах в модальном окне', () => {
      cy.get('[data-testid=ingredient-main]').first().click();
      
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      cy.contains('420').should('exist'); // Белки
      cy.contains('142').should('exist'); // Жиры
      cy.contains('242').should('exist'); // Углеводы
      cy.contains('4242').should('exist'); // Калории
    });
  });

  describe('Создание заказа', () => {

    it('должен успешно создать заказ', () => {
      cy.get('[data-testid="ingredient-bun"]').first().within(() => {
        cy.get('.common_button').contains('Добавить').click();
      });
      cy.get('[data-testid="ingredient-main"]').first().within(() => {
        cy.get('.common_button').contains('Добавить').click();
      });
      
      cy.get('[data-testid=order-button]').click();
      cy.get('[data-testid=order-details]').should('exist');
      cy.contains('12345').should('exist');
      cy.contains('идентификатор заказа').should('exist');
      
      cy.get('[data-testid=modal-close-button]').click();
      cy.get('[data-testid=order-details]').should('not.exist');
      
      cy.get('[data-testid=constructor-bun-top]').should('not.exist');
      cy.get('[data-testid=constructor-ingredient]').should('not.exist');
    });

    it('должен перенаправлять при клике на заказ без авторизации', () => {
      // Очищаем токены
      cy.clearCookie('accessToken');
      window.localStorage.removeItem('refreshToken');
    
      // Перехватываем запрос пользователя
      cy.intercept('GET', 'api/auth/user', { statusCode: 401 }).as('getUserUnauthorized');
    
      // Перезагружаем страницу
      cy.reload();
      cy.wait(1000);
    
      cy.get('[data-testid="ingredient-bun"]').first().within(() => {
        cy.get('.common_button').contains('Добавить').click();
      });
      cy.get('[data-testid="ingredient-main"]').first().within(() => {
        cy.get('.common_button').contains('Добавить').click();
      });
      cy.get('[data-testid="order-button"]').click();
      cy.url().should('include', '/login');

      cy.contains('Вход').should('exist');
      cy.contains('E-mail').should('exist');
      cy.contains('Пароль').should('exist');
    });
  });
});