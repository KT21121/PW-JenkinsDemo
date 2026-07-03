import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ENV } from '../config/env';

test.describe('Feature: User Authentication', () => {
  let loginPage: LoginPage;

  // Se ejecuta antes de cada test dentro de este bloque
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.gotoLogin();
  });

  test('Should log in successfully with valid credentials', async () => {
    // Act (Acción)
    await loginPage.login(ENV.USER_NAME, ENV.PASSWORD);

    // Assert (Verificación)
    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('You logged into a secure area!');
  });

  test('Should display error message with invalid credentials', async () => {
    // Act (Acción)
    await loginPage.login('usuarioFalso', 'claveFalsa');

    // Assert (Verificación)
    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('Your username is invalid!');
  });
});