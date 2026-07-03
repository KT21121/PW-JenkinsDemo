pipeline {
    // 1. Dónde se ejecuta: Le dice a Jenkins que use cualquier agente (esclavo) disponible
    agent any

    // 2. Herramientas: Automatiza la preparación del entorno de Node.js
    tools {
        nodejs 'NodeJS_20' // Este nombre debe coincidir con el configurado en tu Jenkins global
    }

    // 3. Variables de entorno globales para el Pipeline
    environment {
        CI = 'true' // Le avisa a Playwright y a Node que estamos en un entorno de integración continua
        BASE_URL = 'https://the-internet.herokuapp.com'
        
        // Inyección segura de credenciales desde el "Credentials Store" de Jenkins
        USER_NAME = credentials('qa-env-username')
        PASSWORD  = credentials('qa-env-password')
    }

    stages {
        stage('Limpieza y Clonado') {
            steps {
                // Borra ejecuciones anteriores para garantizar que no haya basura retenida
                cleanWs()
            }
        }

        stage('Instalación de Dependencias') {
            steps {
                echo '📦 Instalando dependencias del proyecto...'
                // Usamos npm ci en lugar de npm install para entornos CI/CD
                sh 'npm ci'
            }
        }

        stage('Instalación de Navegadores') {
            steps {
                echo '🌐 Descargando binarios de Playwright y dependencias del Sistema Operativo...'
                // Este paso es CRUCIAL para que no falle en Linux
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Ejecución de Pruebas') {
            steps {
                echo '🚀 Corriendo el framework de automatización...'
                // Ejecutamos los tests. 
                sh 'npx playwright test'
            }
        }
    }

    // 4. Acciones Post-Ejecución: Pase lo que pase (éxito o fallo), esto se ejecuta
    post {
        always {
            echo '📊 Publicando reportes y guardando evidencias...'
            
            // Publica el reporte HTML nativo de Playwright directamente en la interfaz de Jenkins
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report',
                reportTitles: 'Resultado de la Automatización'
            ])

            // Guarda evidencias físicas (videos, capturas, trazas) si algo falló
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
    }
}