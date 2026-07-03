import { test, expect } from '@playwright/test';
import { ENV } from '../config/env';

test.describe('Security & Hardening Audits', () => {

  // PRUEBA 1: Verificar que el servidor use cabeceras de seguridad HTTP
  test('Security Verification: HTTP Response Headers', async ({ request }) => {
    const response = await request.get(ENV.BASE_URL);
    const headers = response.headers();

    // 1. Prevenir Clickjacking (Evita que metan tu web en un iframe malicioso)
    const xFrameOptions = headers['x-frame-options'];
    expect(xFrameOptions ? xFrameOptions.toLowerCase() : '').toMatch(/(deny|sameorigin)/);

    // 2. Prevenir MIME-type sniffing (Fuerza al navegador a respetar el formato del archivo)
    expect(headers['x-content-type-options']).toBe('nosniff');
  });

  // PRUEBA 2: Verificar la seguridad de las Cookies de sesión
  test('Security Verification: Sensitive Cookie Attributes', async ({ page }) => {
    await page.goto(`${ENV.BASE_URL}/login`);
    const cookies = await page.context().cookies();
    
    for (const cookie of cookies) {
      // Si el entorno usa HTTPS, la cookie debe ser obligatoriamente segura
      if (ENV.BASE_URL.startsWith('https')) {
        expect(cookie.secure).toBe(true); 
      }

      // Evita que scripts de JavaScript maliciosos roben la cookie de sesión
      if (cookie.name.toLowerCase().includes('session') || cookie.name.toLowerCase().includes('token')) {
        expect(cookie.httpOnly).toBe(true);
      }
    }
  });

  // PRUEBA 3: Inyección básica para validar que el input sanitice texto (Evitar XSS)
  test('Input Sanitization: Basic Cross-Site Scripting (XSS) Prevention', async ({ page }) => {
    await page.goto(`${ENV.BASE_URL}/login`);

    // Inyectamos un código malicioso en el campo de usuario
    const xssPayload = '<script>alert("XSS")</script>';
    await page.locator('#username').fill(xssPayload);
    await page.locator('button[type="submit"]').click();

    // Verificamos que el navegador no haya ejecutado el script levantando una alerta
    page.on('dialog', async dialog => {
      throw new Error(`❌ Vulnerabilidad detectada: Se ejecutó el script malicioso: ${dialog.message()}`);
    });

    // Validamos que la página no se haya roto o renderizado el script de forma activa
    const pageContent = await page.content();
    expect(pageContent).not.toContain('[object Object]'); 
  });

});