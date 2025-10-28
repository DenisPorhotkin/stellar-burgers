import { 
  IngredientSelectors, 
  ConstructorSelectors, 
  ModalSelectors,
  TextConstants,
  IngredientType,
  CloseMethod
} from '../support/constants';

describe('Burger Constructor', () => {
  beforeEach(() => {
    // Перехватываем все API запросы
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');
    
    // Настраиваем авторизацию
    cy.setupAuth();
    
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.contains(TextConstants.BUILD_BURGER).should('be.visible');
  });

  afterEach(() => {
    // Очищаем токены после тестов
    cy.clearAuth();
  });

  describe('Функциональность ингредиентов', () => {
    it('должен отображать список ингредиентов', () => {      
      cy.checkIngredientsExist();
    });
    
    it('должен добавить булочку в конструктор', () => {
      cy.addIngredient(IngredientType.BUN);
      
      cy.get(IngredientSelectors.CONSTRUCTOR_BUN_TOP).should('exist');
      cy.get(IngredientSelectors.CONSTRUCTOR_BUN_BOTTOM).should('exist');
      cy.get(ConstructorSelectors.NO_BUN_TOP).should('not.exist');
      cy.get(ConstructorSelectors.NO_BUN_BOTTOM).should('not.exist');
    });

    it('должен добавить ингредиент в конструктор', () => {
      cy.addIngredient(IngredientType.MAIN);
      
      cy.get(IngredientSelectors.CONSTRUCTOR_INGREDIENT).should('exist');
      cy.get(ConstructorSelectors.NO_INGREDIENTS).should('not.exist');
    });

    it('должен добавить соус в конструктор', () => {
      cy.addIngredient(IngredientType.SAUCE);
      
      cy.get(IngredientSelectors.CONSTRUCTOR_INGREDIENT).should('exist');
      cy.get(ConstructorSelectors.NO_INGREDIENTS).should('not.exist');
    });
    
    it('должен правильно рассчитать общую стоимость', () => {
      cy.addIngredient(IngredientType.BUN);
      cy.addIngredient(IngredientType.MAIN);
      
      cy.get(ConstructorSelectors.TOTAL_PRICE).should('not.contain', '0');
      cy.get(ConstructorSelectors.ORDER_BUTTON).should('not.be.disabled');
    });
  });

  describe('Модальные окна', () => {
    it('должен открывать и закрывать модальное окно ингредиента', () => {
      cy.openIngredientModal(IngredientType.MAIN);
      
      cy.get(ModalSelectors.MODAL).should('exist');
      cy.contains(TextConstants.INGREDIENT_DETAILS).should('exist');
      cy.contains(TextConstants.MARS_PATTY).should('exist');
      
      cy.closeModal(CloseMethod.BUTTON);
    });

    it('должен закрыть модальное окно по нажатию клавиши Esc', () => {
      cy.openIngredientModal(IngredientType.MAIN);
      cy.closeModal(CloseMethod.ESC);
    });
    
    it('должен закрыть модальное окно щелчком мыши по оверлею', () => {
      cy.openIngredientModal(IngredientType.MAIN);
      cy.closeModal(CloseMethod.OVERLAY);
    });    

    it('должны отображать правильные данные об ингредиентах в модальном окне', () => {
      cy.openIngredientModal(IngredientType.MAIN);
      
      cy.contains(TextConstants.MARS_PATTY).should('exist');
      cy.contains('420').should('exist'); // Белки
      cy.contains('142').should('exist'); // Жиры
      cy.contains('242').should('exist'); // Углеводы
      cy.contains('4242').should('exist'); // Калории
      
      cy.closeModal();
    });
  });

  describe('Создание заказа', () => {
    it('должен успешно создать заказ', () => {
      cy.createOrder([IngredientType.BUN, IngredientType.MAIN]);
      
      cy.contains(TextConstants.ORDER_ID).should('exist');
      cy.contains(TextConstants.ORDER_ID_TEXT).should('exist');
      
      cy.closeModal();
      
      // Проверяем, что конструктор очистился после заказа
      cy.get(IngredientSelectors.CONSTRUCTOR_BUN_TOP).should('not.exist');
      cy.get(IngredientSelectors.CONSTRUCTOR_INGREDIENT).should('not.exist');
    });

    it('должен перенаправлять при клике на заказ без авторизации', () => {
      // Очищаем токены и перехватываем запрос с ошибкой
      cy.clearAuth();
      cy.intercept('GET', 'api/auth/user', { statusCode: 401 }).as('getUserUnauthorized');
    
      // Перезагружаем страницу
      cy.reload();
      cy.wait(1000);
    
      // Добавляем ингредиенты и пытаемся создать заказ
      cy.addIngredient(IngredientType.BUN);
      cy.addIngredient(IngredientType.MAIN);
      cy.get(ConstructorSelectors.ORDER_BUTTON).click();
      
      // Проверяем перенаправление на страницу логина
      cy.url().should('include', '/login');
      cy.contains(TextConstants.LOGIN_TITLE).should('exist');
      cy.contains(TextConstants.EMAIL_LABEL).should('exist');
      cy.contains(TextConstants.PASSWORD_LABEL).should('exist');
    });
  });
});