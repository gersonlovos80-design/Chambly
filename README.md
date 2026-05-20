# Chambly WebApp 

Chambly es una plataforma digital e híbrida diseñada para el contexto de El Salvador, orientada a la gestión y contratación de servicios técnicos y oficios independientes. El sistema actúa como un puente seguro entre profesionales que desean construir su identidad laboral y clientes que buscan soluciones rápidas, confiables y verificadas.

## Propósito del Proyecto

Este proyecto surge como parte de la asignatura **Ingeniería de Software I** en la **Universidad Gerardo Barrios (UGB)**. El desarrollo se basa en la metodología *Design Sprint* y busca resolver los principales puntos de tensión del sector informal, tales como la falta de referencias, la invisibilidad laboral y la dificultad para validar la identidad de los trabajadores.

## Stack Tecnológico

El desarrollo del ecosistema se divide en las siguientes tecnologías principales:

* **Frontend:** Vue.js y React estructurados con **Vite (v6)**, estilizados con **Tailwind CSS** y componentes de **Radix UI**.
* **Animaciones & Interactividad:** Motion.
* **Backend:** PHP nativo y Laravel Framework.
* **Base de Datos:** MySQL administrado a través de **phpMyAdmin**.
* **Control de Versiones & Gestión:** Git, GitHub y Trello para el tablero Kanban.

## Planificación del Proyecto (Roadmap de Sprints)

El desarrollo de Chambly está estructurado en 4 ciclos incrementales (Sprints):

1. **DSprint 1 - Gestión de Usuarios:** Implementación del módulo de autenticación (Registro y Login diferenciado por Clientes y Profesionales), validación de identidad y configuración base de la Base de Datos.
2. **DSprint 2 - Reportería y Gestión de Perfiles:** Funcionalidades para la edición/visualización de perfiles y desarrollo de un Dashboard analítico para administradores con estadísticas de usuarios. Permite dejar reseñas y mostrar trabajos.
3. **DSprint 3 - Integración de APIs y Notificaciones:** Conexiones con servicios externos para pasarelas de pago, geolocalización, y sistema de alertas internas sobre solicitudes y actualizaciones.
4. **DSprint 4 - Dashboard Analítico y Despliegue Pre-Feria:** Pruebas funcionales exhaustivas, optimización de métricas clave y preparación del entorno de producción para el lanzamiento de la aplicación.


## Estructura General del Repositorio

text
├── src/            # Código fuente (Vue / React / Laravel)
├── public/         # Archivos públicos y recursos estáticos
├── database/       # Scripts de migración y estructura MySQL
└── README.md       # Presentación e instrucciones del proyecto