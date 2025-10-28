/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import { 
  IngredientSelectors, 
  ConstructorSelectors, 
  ModalSelectors,
  TextConstants,
  IngredientType,
  CloseMethod,
  AuthOptions
} from './constants';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Настройка авторизации пользователя
       * @param options Опции авторизации
       */
      setupAuth(options?: AuthOptions): Chainable<void>;
      
      /**
       * Добавление ингредиента в конструктор
       * @param type Тип ингредиента
       */
      addIngredient(type?: IngredientType): Chainable<void>;
      
      /**
       * Создание заказа
       * @param ingredients Массив типов ингредиентов
       */
      createOrder(ingredients?: IngredientType[]): Chainable<void>;
      
      /**
       * Открытие модального окна ингредиента
       * @param type Тип ингредиента
       */
      openIngredientModal(type?: IngredientType): Chainable<void>;
      
      /**
       * Закрытие модального окна
       * @param method Способ закрытия
       */
      closeModal(method?: CloseMethod): Chainable<void>;
      
      /**
       * Очистка данных авторизации
       */
      clearAuth(): Chainable<void>;
      
      /**
       * Проверка отображения списка ингредиентов
       */
      checkIngredientsExist(): Chainable<void>;
    }
  }
}

// Команда для настройки авторизации
Cypress.Commands.add('setupAuth', (options: AuthOptions = {}) => {
  const {
    hasToken = true,
    userFixture = 'user.json',
    interceptUser = true
  } = options;

  if (interceptUser) {
    cy.intercept('GET', 'api/auth/user', { fixture: userFixture }).as('getUser');
  }
  
  if (hasToken) {
    cy.setCookie('accessToken', 'fake-access-token');
    window.localStorage.setItem('refreshToken', 'fake-refresh-token');
  }
});

// Команда для добавления ингредиента
Cypress.Commands.add('addIngredient', (type: IngredientType = IngredientType.MAIN) => {
  const selectorMap: Record<IngredientType, string> = {
    [IngredientType.BUN]: IngredientSelectors.BUN,
    [IngredientType.MAIN]: IngredientSelectors.MAIN,
    [IngredientType.SAUCE]: IngredientSelectors.SAUCE
  };

  cy.get(selectorMap[type]).first().within(() => {
    cy.get('.common_button').contains(TextConstants.ADD_BUTTON).click();
  });
});

// Команда для создания заказа
Cypress.Commands.add('createOrder', (ingredients: IngredientType[] = [IngredientType.BUN, IngredientType.MAIN]) => {
  ingredients.forEach((type: IngredientType) => {
    cy.addIngredient(type);
  });
  
  cy.get(ConstructorSelectors.ORDER_BUTTON).click();
  cy.get(ModalSelectors.ORDER_DETAILS).should('exist');
});

// Команда для открытия модального окна
Cypress.Commands.add('openIngredientModal', (type: IngredientType = IngredientType.MAIN) => {
  const selectorMap: Record<IngredientType, string> = {
    [IngredientType.BUN]: IngredientSelectors.BUN,
    [IngredientType.MAIN]: IngredientSelectors.MAIN,
    [IngredientType.SAUCE]: IngredientSelectors.SAUCE
  };

  cy.get(selectorMap[type]).first().click();
  cy.get(ModalSelectors.MODAL).should('exist');
});

// Команда для закрытия модального окна
Cypress.Commands.add('closeModal', (method: CloseMethod = CloseMethod.BUTTON) => {
  const methods: Record<CloseMethod, () => void> = {
    [CloseMethod.BUTTON]: () => cy.get(ModalSelectors.MODAL_CLOSE_BUTTON).click(),
    [CloseMethod.ESC]: () => cy.get('body').type('{esc}', { force: true }),
    [CloseMethod.OVERLAY]: () => cy.get(ModalSelectors.MODAL_OVERLAY).click({ force: true })
  };

  methods[method]();
  cy.get(ModalSelectors.MODAL).should('not.exist');
});

// Команда для очистки авторизации
Cypress.Commands.add('clearAuth', () => {
  cy.clearCookie('accessToken');
  window.localStorage.removeItem('refreshToken');
});

// Команда для проверки ингредиентов
Cypress.Commands.add('checkIngredientsExist', () => {
  cy.get(IngredientSelectors.BUN).should('exist');
  cy.get(IngredientSelectors.MAIN).should('exist');
  cy.get(IngredientSelectors.SAUCE).should('exist');
});