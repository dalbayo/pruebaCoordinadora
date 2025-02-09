
DROP DATABASE IF EXISTS coordinadora;

CREATE DATABASE coordinadora CHARACTER SET utf8;
  

CREATE TABLE departamento (
  id serial,
  nombre VARCHAR(100) NOT NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP
);
 
CREATE TABLE ciudad (
  id serial ,
  nombre VARCHAR(100) NOT NULL,  
  estado BIGINT UNSIGNED NOT NULL,
  id_departamento BIGINT UNSIGNED NOT NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_departamento) REFERENCES departamento(id)
);



CREATE TABLE vehiculo (
  id serial,
  placa VARCHAR(10) NOT NULL,
  conductor VARCHAR(10) NOT NULL
);


CREATE TABLE perfil (
  id serial,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE usuario (
  id serial,
  nombres VARCHAR(100) NOT NULL,
  primer_apellido VARCHAR(100) NOT NULL,
  segundo_apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(200) NOT NULL,
  clave VARCHAR(10) NOT NULL, 
  id_perfil BIGINT UNSIGNED NOT NULL,
  FOREIGN KEY (id_perfil) REFERENCES perfil(id)
);


CREATE TABLE tipo_documento (
  id serial,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE persona (
  id serial,
  nombres VARCHAR(100) NOT NULL,
  primer_apellido VARCHAR(100) NOT NULL,
  segundo_apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(200) NOT NULL,
  telefono int not null,
  direccion VARCHAR(200) NOT NULL,
  numero_documento VARCHAR(20) NOT NULL, 
  id_tipo_documento BIGINT UNSIGNED NOT NULL,
  FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento(id)
);


CREATE TABLE tipo_mercancia (
  id serial,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(100) NOT NULL
);
CREATE TABLE tipo_servicio (
  id serial,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(100) NOT NULL
);


CREATE TABLE encomienda (
  id serial,
  peso VARCHAR(50) NOT NULL,
  dimensiones VARCHAR(150) NOT NULL, 
  telefono int not null,
  valor_declarado DOUBLE(10,3) not null,
  valor_encomienda DOUBLE(10,3) not null,
  cantidad_articulos int not null,
  direccion_envio VARCHAR(200) NOT NULL,
  coordenadas_envio VARCHAR(200) NOT NULL,
  numero_documento VARCHAR(20) NOT NULL, 
  id_ciudad_origen BIGINT UNSIGNED NOT NULL,
  id_ciudad_destino BIGINT UNSIGNED NOT NULL,
  id_remitente BIGINT UNSIGNED NOT NULL,
  id_destinatario BIGINT UNSIGNED NOT NULL,
  id_tipo_mercancia BIGINT UNSIGNED NOT NULL,
  id_tipo_servicio BIGINT UNSIGNED NOT NULL, 
  FOREIGN KEY (id_ciudad_origen) REFERENCES ciudad(id), 
  FOREIGN KEY (id_ciudad_destino) REFERENCES ciudad(id), 
  FOREIGN KEY (id_remitente) REFERENCES persona(id), 
  FOREIGN KEY (id_destinatario) REFERENCES persona(id), 
  FOREIGN KEY (id_tipo_mercancia) REFERENCES tipo_mercancia(id), 
  FOREIGN KEY (id_tipo_servicio) REFERENCES tipo_servicio(id)
);
Número de guía o rastreo
Peso y dimensiones del paquete
Tipo de servicio (estándar, express, prioritario)
Fecha y hora de envío
Fecha estimada de entrega
Origen y destino del paquete

vehiculos
ciudades
rutas
usuarios
perfiles
encomiendas
guias
















