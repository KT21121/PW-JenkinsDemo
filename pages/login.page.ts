import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // 1. Definición de los Localizadores (Locators) usando buenas prácticas
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  readonly flashMessage: Locator;

  constructor(page: Page) {
    super(page); // Llama al constructor de BasePage
    
    // Inicializamos los localizadores
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.flashMessage = page.locator('#flash');
  }

  // 2. Acciones o Flujos de la página
  async gotoLogin(): Promise<void> {
    await this.navigateTo('/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.typeIn(this.usernameInput, username);
    await this.typeIn(this.passwordInput, password);
    await this.clickOn(this.loginButton);
  }
}