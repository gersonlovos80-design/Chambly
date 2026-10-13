# Chambly WebApp 

Chambly es una plataforma digital pensada para la realidad de El Salvador. Funciona como un puente seguro en línea que conecta a trabajadores de oficios independientes (como fontaneros, electricistas o mecánicos) con clientes que necesitan soluciones rápidas, confiables y con total seguridad. 

El objetivo es ayudar a que los profesionales muestren la calidad de su trabajo y que los clientes puedan contratarlos sin desconfianza.

## Pagos y configuración de la base de datos

El historial se registra cuando el cliente acepta una factura enviada por el profesional. Para habilitarlo en una instalación existente, importa `chambly_api/migracion_pagos.sql` en la base de datos `chambly_db` desde phpMyAdmin. La migración crea la tabla de pagos; no procesa cobros ni cambia los datos de solicitudes existentes.

Los pagos con tarjeta quedan pendientes hasta integrar una pasarela de pago. Los pagos en efectivo quedan pendientes hasta que el cliente confirme que recibió el servicio y pagó.


## Propósito del Proyecto

Este sistema nace como proyecto principal en la materia de **Ingeniería de Software I** de la **Universidad Gerardo Barrios (UGB)**. Utilizando el método *Design Sprint*, buscamos solucionar problemas reales de nuestro entorno, como el miedo de los clientes al contratar a un desconocido, la falta de recomendaciones confiables y la dificultad que tienen los trabajadores para darse a conocer formalmente.


## Plan de Trabajo (Nuestros Sprints)

El desarrollo de Chambly está dividido en 4 etapas o ciclos de trabajo:

1. **Ciclo 1 - Control de Usuarios:** Creación de las pantallas de registro y de inicio de sesión (separando los accesos para Clientes y para Profesionales), configurando los primeros filtros para validar la identidad y preparando la base de datos.
2. **Ciclo 2 - Gestión de Perfiles y Reseñas:** Desarrollo de los perfiles donde los técnicos podrán mostrar fotos de sus trabajos anteriores y donde los clientes podrán dejarles comentarios y calificaciones. También incluye un panel de control para que el administrador vea las estadísticas de uso.
3. **Ciclo 3 - Conexiones y Alertas (APIs):** Integración de herramientas externas para el manejo seguro de pagos, mapas o geolocalización, y un sistema interno de notificaciones para avisar sobre solicitudes de trabajo.
4. **Ciclo 4 - Pruebas Finales y Lanzamiento:** Pruebas a fondo para asegurar que nada falle, optimización de la velocidad de la app y preparación final de la plataforma para dejarla lista de cara a la Feria de Proyectos.

