import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ENV } from '../config/env';

// test.describe agrupa casos de prueba relacionados bajo una misma suite
test.describe('Feature: Autenticación de Usuarios', () => {
  let loginPage: LoginPage;

  // El bloque beforeEach se ejecuta antes de CADA test dentro de este describe
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.gotoLogin();
  });

  test('Debería iniciar sesión exitosamente con credenciales válidas', async () => {
    // Act (Acción): Usamos las variables seguras de nuestro archivo .env
    await loginPage.login(ENV.USER_NAME, ENV.PASSWORD);

    // Assert (Verificación): Validamos que el mensaje de éxito sea visible
    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('You logged into a secure area!');
  });

  test('Debería mostrar un error al usar credenciales inválidas', async () => {
    // Act (Acción): Quemamos datos falsos a propósito para forzar el error
    await loginPage.login('usuarioFalso', 'claveFalsa');

    // Assert (Verificación): Validamos el mensaje de rechazo
    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('Your username is invalid!');
  });
});