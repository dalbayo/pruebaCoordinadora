
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
    cd pruebaCoordinadora
    ```

3.  Copia el archivo `.env.example` a `.env` y configura las variables de entorno necesarias, 
   como las credenciales de la base de datos y la configuración de Redis.

   4.  Despliegue manual del proyecto

       DEBIDO A QUE NO SE PUDO FINALIZAR LA VALIDACIÓN DE DOCKER SE DEBE TENER 
       INSTALADO MYSQL CON EL FIN DE EJECUTAR LOS 
       SCRIPT bd.sql en primer lugar y despues data.sql los cuales se encuentran
       en la ruta pruebaCoordinadora\src\script 
       se debe modificar el usuario y la clave del usuario de bd 
       Se debe tener instalado un contenedor para redis, 
       auqnue esta parte no se pudo probar el ejemplo basico de uso de redis 
       esta en el archivo pruebaCoordinadora\src\controllers\RutasController.js
    
           /*fastifyRedis.get("getAllRutas/"+pagina, (err, val) => { 
               reply.status(ERRORES_HTTP["200"].code).send( val)
           })*/


           let rutas = await getRutasAllService(pagina)
           /*fastifyRedis.set("getAllRutas/"+pagina,{error:null,response:rutas}, (err) => {
               reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:rutas});
           })*/

        Para validar Swagger solo debe abrir la url http://localhost:8000/docs donde podra ver la información de Swager

5.  Construye y levanta los contenedores:
       ```bash
       docker-compose up -d
       ```

## Uso

*   La aplicación estará disponible en `http://localhost:8000/`.
*   La documentación de la API Swagger estará disponible en `http://localhost:8000/docs`.
*   Para consumir las apis solo debe abrir en Postman el archivo
*   coordinadora.postman_collection.json en la ruta en la ruta pruebaCoordinadora\src\script


## Endpoints de la API

Lista de los endpoints principales de la API y su descripción.

## Contribución

Si deseas contribuir a este proyecto, por favor, abre un "issue"
o envía un "pull request".

## Licencia

[Enlace a la licencia del proyecto](https://opensource.org/licenses/MIT)

## Contacto

DANIEL ALFONSO BARRERA 
daniel.barrera.adame@gmail.com

## Agradecimientos

Quisiera expresar mi profundo agradecimiento por la oportunidad que me han brindado
de unirme a COORDINADORA como DESARROLLADOR SENIOR. 
Me siento muy honrado y emocionado de formar parte de su equipo.

Espero pronto hacer parte del equipo Coordinadora y poder crecer y aportar en los diferentes proyectos que se desarrollan.

## Notas Adicionales

No he tenido teimpo de finalizar la validación de docker y redis 
aunque falto poco para lograr estos objetivos no me dio el tiempo.

En el caso de las pruebas unitarias no he podido iniciar con el proceso de realizar dichas pruebas.
