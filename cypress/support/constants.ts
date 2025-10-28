// Типы для селекторов
export interface Selectors {
  readonly [key: string]: string;
}

// Типы для текстовых констант
export interface TextConstants {
  readonly [key: string]: string;
}

// Типы для пользовательских команд
export enum IngredientType {
  BUN = 'bun',
  MAIN = 'main',
  SAUCE = 'sauce'
}

export enum CloseMethod {
  BUTTON = 'button',
  ESC = 'esc',
  OVERLAY = 'overlay'
}

export interface AuthOptions {
  hasToken?: boolean;
  userFixture?: string;
  interceptUser?: boolean;
}

// Селекторы для ингредиентов
export const IngredientSelectors: Selectors = {
  BUN: '[data-testid="ingredient-bun"]',
  MAIN: '[data-testid="ingredient-main"]',
  SAUCE: '[data-testid="ingredient-sauce"]',
  CONSTRUCTOR_INGREDIENT: '[data-testid="constructor-ingredient"]',
  CONSTRUCTOR_BUN_TOP: '[data-testid="constructor-bun-top"]',
  CONSTRUCTOR_BUN_BOTTOM: '[data-testid="constructor-bun-bottom"]'
} as const;

// Селекторы для конструктора
export const ConstructorSelectors: Selectors = {
  NO_BUN_TOP: '[data-testid="no-bun-top"]',
  NO_BUN_BOTTOM: '[data-testid="no-bun-bottom"]',
  NO_INGREDIENTS: '[data-testid="no-ingredients"]',
  TOTAL_PRICE: '[data-testid="total-price"]',
  ORDER_BUTTON: '[data-testid="order-button"]'
} as const;

// Селекторы для модальных окон
export const ModalSelectors: Selectors = {
  MODAL: '[data-testid="modal"]',
  MODAL_CLOSE_BUTTON: '[data-testid="modal-close-button"]',
  MODAL_OVERLAY: '[data-testid="modal-overlay"]',
  ORDER_DETAILS: '[data-testid="order-details"]'
} as const;

// Селекторы для страницы логина
export const LoginSelectors: Selectors = {
  EMAIL_INPUT: 'input[name="email"]',
  PASSWORD_INPUT: 'input[name="password"]',
  SUBMIT_BUTTON: 'button[type="submit"]'
} as const;

// Текстовые константы
export const TextConstants: TextConstants = {
  BUILD_BURGER: 'Соберите бургер',
  ADD_BUTTON: 'Добавить',
  INGREDIENT_DETAILS: 'Детали ингредиента',
  MARS_PATTY: 'Биокотлета из марсианской Магнолии',
  ORDER_ID: '12345',
  ORDER_ID_TEXT: 'идентификатор заказа',
  LOGIN_TITLE: 'Вход',
  EMAIL_LABEL: 'E-mail',
  PASSWORD_LABEL: 'Пароль'
} as const;