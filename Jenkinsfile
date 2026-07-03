pipeline {
    // Le dice a Jenkins que use cualquier agente (máquina esclava) disponible
    agent any

    // Automatiza la preparación del entorno de Node.js
    tools {
        nodejs 'NodeJS_20' // Este nombre debe coincidir con el que configures en Jenkins
    }

    // Variables de entorno globales para la ejecución
    environment {
        CI = 'true' // Le avisa a Playwright que está corriendo en un servidor de integración continua
        BASE_URL = 'https://the-internet.herokuapp.com'
        
        // Inyección segura de credenciales desde el almacén secreto de Jenkins
        USER_NAME = credentials('qa-env-username')
        PASSWORD  = credentials('qa-env-password')
    }

    stages {
        stage('Limpieza de Espacio') {
            steps {
                // Borra ejecuciones previas para garantizar que no haya basura retenida
                cleanWs()
            }
        }

        stage('Instalación de Dependencias') {
            steps {
                echo '📦 Instalando dependencias del proyecto...'
                // npm ci es más rápido y estricto que npm install para entornos de CI/CD
                sh 'npm ci'
            }
        }

        stage('Instalación de Navegadores') {
            steps {
                echo '🌐 Descargando navegadores y librerías del Sistema Operativo...'
                // Crucial para entornos Linux (como servidores Jenkins o Docker)
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Ejecución de Pruebas') {
            steps {
                echo '🚀 Corriendo la suite de pruebas funcionales...'
                // Lanza los tests de forma automatizada
                sh 'npx playwright test'
            }
        }
    }

    // Acciones que se ejecutan SIEMPRE, sin importar si los tests pasaron o fallaron
    post {
        always {
            echo '📊 Publicando reportes en Jenkins...'
            
            // Publica el reporte HTML interactivo de Playwright directamente en Jenkins
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report',
                reportTitles: 'Resultados de Automatización'
            ])

            // Guarda las evidencias físicas (videos, capturas, trazas) si algo falló
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
    }
}