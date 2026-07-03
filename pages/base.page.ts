import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Método común para navegar a cualquier ruta relativa a la baseURL
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  // Método genérico para escribir texto limpiando el input primero
  async typeIn(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill('');
    await locator.fill(text);
  }

  // Método genérico para hacer click asegurando que el elemento sea interactuable
  async clickOn(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }
}