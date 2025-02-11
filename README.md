
# PRUEBA TECNICA COORDINADORA

Autor:Daniel Alfonso Barrera Adame

## Descripción

Este es un proyecto de ejemplo que utiliza Node.js, MySQL,
Swagger y Redis, desplegado en contenedores Docker.
El proyecto simula una empresa logística que quiere desarrollar una API
para gestionar el envío de paquetes, optimizar rutas de entrega
y permitir a los clientes rastrear sus pedidos en tiempo real.
La API maneja tipos de documento, tipos de servicio, tipos de mercancia,
personas,  usuarios, pedidos, rutas y estados de envío, planilla de viaje
asegurando seguridad, eficiencia y escalabilidad.

## Tecnologías Utilizadas

*   Node.js: Entorno de ejecución de JavaScript del lado del servidor.
*   MySQL: Sistema de gestión de bases de datos relacional.
*   Swagger: Herramienta para la documentación y prueba de APIs REST.
*   Redis: Almacén de datos en memoria para mejorar el rendimiento.
*   Docker: Plataforma para la creación y gestión de contenedores.
*   AWJ: JSON Web Token (JWT) es un estándar abierto basado en JSON (RFC 7519)
*   que define una forma compacta y autosuficiente de transmitir de forma segura información como un objeto JSON entre las partes.

## Requisitos

*   MySql, Node.js, Redis, Docker, y Docker Compose instalados. 

## Instalación

1.  Clona este repositorio:

    ```bash
    git clone [https://github.com/dalbayo/pruebaCoordinadora.git](https://github.com/dalbayo/pruebaCoordinadora.git)
    ```

2.  Accede al directorio del proyecto:

    ```bash
    cd nombre-del-proyecto
    ```

3.  Copia el archivo `.env.example` a `.env` y configura las variables de entorno necesarias, como las credenciales de la base de datos y la configuración de Redis.

4.  Construye y levanta los contenedores:

    ```bash
    docker-compose up -d
    ```

## Uso

*   La aplicación estará disponible en `http://localhost:puerto-de-la-aplicacion`.
*   La documentación de la API Swagger estará disponible en `http://localhost:puerto-de-la-aplicacion/api-docs`.

## Endpoints de la API

Lista de los endpoints principales de la API y su descripción.

## Contribución

Si deseas contribuir a este proyecto, por favor, abre un "issue" o envía un "pull request".

## Licencia

[Enlace a la licencia del proyecto](https://opensource.org/licenses/MIT)

## Contacto

Tu nombre o el nombre del equipo de desarrollo.

## Agradecimientos

Menciona a terceros o librerías que fueron de gran ayuda para el desarrollo del proyecto.

## Notas Adicionales

Espacio para agregar cualquier información adicional relevante sobre el proyecto.
