import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, // Ejecución paralela para ahorrar tiempo
  forbidOnly: !!process.env.CI, // Evita subir tests con .only a producción
  retries: process.env.CI ? 2 : 0, // Reintentos en CI/CD si falla un test
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']], // Reporte HTML detallado
  
  use: {
    baseURL: process.env.BASE_URL || 'https://example.com',
    trace: 'on-first-retry', // Graba trazas (videos/pantallazos) si el test falla
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configuramos los navegadores principales */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});