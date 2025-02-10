
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
  conductor VARCHAR(250) NOT NULL,
  estado BIGINT UNSIGNED NOT NULL DEFAULT '1',
  peso DOUBLE(10,3) not null,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE perfil (
  id serial,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(100) NOT NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE usuario (
  id serial,
  nombres VARCHAR(100) NOT NULL,
  primer_apellido VARCHAR(100) NOT NULL,
  segundo_apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(200) NOT NULL,
  clave VARCHAR(50) NOT NULL,
  id_perfil BIGINT UNSIGNED NOT NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_perfil) REFERENCES perfil(id)
);


CREATE TABLE tipo_documento (
  id serial,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(100) NOT NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE persona (
  id serial,
  nombres VARCHAR(100) NOT NULL,
  primer_apellido VARCHAR(100) NOT NULL,
  segundo_apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(200) NOT NULL,
  telefono VARCHAR(15)  not null,
  direccion VARCHAR(200) NOT NULL,
  numero_documento VARCHAR(20) NOT NULL,
  id_tipo_documento BIGINT UNSIGNED NOT NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento(id)
);


CREATE TABLE tipo_mercancia (
  id serial,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(100) NOT NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE tipo_servicio (
  id serial,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(100) NOT NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE ruta (
  id serial,
  nombre VARCHAR(250) NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  id_ciudad_origen BIGINT UNSIGNED NOT NULL,
  id_ciudad_destino BIGINT UNSIGNED NOT NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_ciudad_origen) REFERENCES ciudad(id),
  FOREIGN KEY (id_ciudad_destino) REFERENCES ciudad(id)
);


CREATE TABLE ruta_principal (
  id serial,
  nombre VARCHAR(250) NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  id_ciudad_origen BIGINT UNSIGNED NOT NULL,
  id_ciudad_destino BIGINT UNSIGNED NOT NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_ciudad_origen) REFERENCES ciudad(id),
  FOREIGN KEY (id_ciudad_destino) REFERENCES ciudad(id)
);

CREATE TABLE ruta_secundaria (
  id serial,
  nombre VARCHAR(250) NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  orden  int not null,
  id_ruta_principal BIGINT UNSIGNED NOT NULL,
  id_ruta BIGINT UNSIGNED NOT NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_ruta_principal) REFERENCES ruta_principal(id),
  FOREIGN KEY (id_ruta) REFERENCES ruta(id)
);

CREATE TABLE planilla_viaje (
  id serial,
  peso DOUBLE(10,3) NOT NULL,
  valor_viaje DOUBLE(10,3) not null,
  cantidad_encomiendas int not null,
  notas VARCHAR(500) NOT NULL,
  estado BIGINT UNSIGNED NOT NULL DEFAULT '1',
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
  fecha_salida_real DATETIME  ,
  fecha_salida DATE,
  fecha_fin_estimada DATE,
  ruta_principal BIGINT UNSIGNED NOT NULL,
  id_vehiculo BIGINT UNSIGNED NOT NULL,

  FOREIGN KEY (ruta_principal) REFERENCES ruta_principal(id),
  FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id)
);

CREATE TABLE planilla_viaje_historial (
  id serial,
  estado VARCHAR(250) NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  id_planilla_viaje BIGINT UNSIGNED NOT NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_planilla_viaje) REFERENCES planilla_viaje(id)
);


CREATE TABLE encomienda (
  id serial,
  peso DOUBLE(10,3) NOT NULL,
  dimensiones VARCHAR(150) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  valor_declarado DOUBLE(10,3) not null,
  valor_encomienda DOUBLE(10,3) not null,
  cantidad_articulos int not null,
  direccion_envio VARCHAR(200) NOT NULL,
  coordenadas_envio VARCHAR(200) NOT NULL,
  estado BIGINT UNSIGNED NOT NULL DEFAULT '1',
  notas VARCHAR(250) NOT NULL,
  id_ciudad_origen BIGINT UNSIGNED NOT NULL,
  id_ciudad_destino BIGINT UNSIGNED NOT NULL,
  id_remitente BIGINT UNSIGNED NOT NULL,
  id_destinatario BIGINT UNSIGNED NOT NULL,
  id_tipo_mercancia BIGINT UNSIGNED NOT NULL,
  id_tipo_servicio BIGINT UNSIGNED NOT NULL,
  id_planilla_viaje BIGINT UNSIGNED ,
  fecha_entrega DATETIME NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_ciudad_origen) REFERENCES ciudad(id),
  FOREIGN KEY (id_ciudad_destino) REFERENCES ciudad(id),
  FOREIGN KEY (id_remitente) REFERENCES persona(id),
  FOREIGN KEY (id_destinatario) REFERENCES persona(id),
  FOREIGN KEY (id_tipo_mercancia) REFERENCES tipo_mercancia(id),
  FOREIGN KEY (id_tipo_servicio) REFERENCES tipo_servicio(id),
  FOREIGN KEY (id_planilla_viaje) REFERENCES planilla_viaje(id)
);


CREATE TABLE encomienda_historial (
  id serial,
  estado VARCHAR(250) NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  id_encomienda BIGINT UNSIGNED NOT NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_encomienda) REFERENCES encomienda(id)
);


CREATE TABLE encomienda_planilla_viaje (
  id_encomienda BIGINT UNSIGNED NOT NULL,
  id_planilla_viaje BIGINT UNSIGNED NOT NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_encomienda,id_planilla_viaje),
  FOREIGN KEY (id_encomienda) REFERENCES encomienda(id) ,
  FOREIGN KEY (id_planilla_viaje) REFERENCES planilla_viaje(id)
);


CREATE TABLE encomienda_planilla_viaje_historico (
  id serial,
  estado VARCHAR(250) NOT NULL,
  descripcion VARCHAR(500) NOT NULL,
  id_encomienda BIGINT UNSIGNED NOT NULL,
  id_planilla_viaje BIGINT UNSIGNED NOT NULL,
  creation_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
  modification_time DATETIME ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE Customers (
          order_id INT,
          product_id INT,
          amount INT,
          PRIMARY KEY (order_id, product_id)
     ) ;



CREATE PROCEDURE coordinadora.createPlanillaViaje(
    IN pesoIN DOUBLE,
    IN valorViajeIN DOUBLE,
    IN cantidadEncomiendasIN int,
    IN notasIN  VARCHAR(500),
    IN estadoIN  BIGINT,
    IN estadoVehiculoIN  BIGINT,
    IN fecha_salidaIN  DATE,
    IN fecha_fin_estimadaIN DATE,
    IN ruta_principalIN BIGINT,
    IN id_vehiculoIN BIGINT,
    OUT respuestaOut VARCHAR(500)
    )
begin
	DECLARE estadoVehiculo BIGINT;
	DECLARE idPlanilla BIGINT;

	      set respuestaOut = 'Error: .';
	SET estadoVehiculo = (SELECT v.estado from vehiculo v WHERE  v.id = id_vehiculoIN  );

	IF (estadoVehiculo  IS null) THEN
	      set respuestaOut = 'Error: El vehiculo no existe.';
	elseif (estadoVehiculoIN <> estadoVehiculo) THEN
	      set respuestaOut = 'Error: El vehiculo no esta activo.';
	ELSE
	      INSERT INTO coordinadora.planilla_viaje
			(peso, valor_viaje, cantidad_encomiendas, notas, estado, creation_time, modification_time, fecha_salida,
			fecha_fin_estimada, ruta_principal, id_vehiculo)
			VALUES(pesoIN, valorViajeIN, cantidadEncomiendasIN, notasIN, estadoIN, CURRENT_TIMESTAMP, null, fecha_salidaIN,
			fecha_fin_estimadaIN, ruta_principalIN, id_vehiculoIN);

		SET idPlanilla = (SELECT LAST_INSERT_ID());
	INSERT INTO coordinadora.planilla_viaje_historial (estado, descripcion, id_planilla_viaje, creation_time)
				VALUES('PLANILLA CREADA ', 'PLANILLA CREADA ', idPlanilla, CURRENT_TIMESTAMP);

	      set respuestaOut = 'Planilla de viaje creada exitosamente.';
	END if;
	select respuestaOut;

end;




CREATE PROCEDURE coordinadora.createEncomienda(
		 IN pesoIN DOUBLE,
		 IN dimensionesIN   VARCHAR(500),
		 IN telefonoIN    VARCHAR(20),
		 IN valorDeclaradoIN DOUBLE,
		 IN valorEncomiendaIN DOUBLE,
		 IN cantidadArticulosIN int,
		 IN direccionIN   VARCHAR(200),
		 IN coordenadasIN   VARCHAR(200),
		 IN estadoIN BIGINT ,
		 IN notasIN   VARCHAR(250),
		 IN ciudadOrigenIN BIGINT,
		 IN ciudadDestinoIN BIGINT,
		 IN remitenteIN BIGINT,
		 IN destinatarioIN BIGINT,
		 IN tipoMercanciaIN BIGINT,
		 IN tipoServicio BIGINT ,
		OUT respuestaOut VARCHAR(500)
    )
	begin
		DECLARE idEncomienda BIGINT;


			  INSERT INTO coordinadora.encomienda
				(peso, dimensiones, telefono, valor_declarado, valor_encomienda, cantidad_articulos, direccion_envio, coordenadas_envio, estado, notas, id_ciudad_origen, id_ciudad_destino, id_remitente, id_destinatario, id_tipo_mercancia, id_tipo_servicio)
				VALUES(pesoIN ,dimensionesIN    ,telefonoIN    ,valorDeclaradoIN ,valorEncomiendaIN ,cantidadArticulosIN, direccionIN  ,coordenadasIN  ,estadoIN   ,notasIN  ,ciudadOrigenIN  ,ciudadDestinoIN  ,remitenteIN  ,destinatarioIN  ,tipoMercanciaIN  ,tipoServicio) ;

			SET idEncomienda = (SELECT LAST_INSERT_ID());
			INSERT INTO coordinadora.encomienda_historial
				(estado, descripcion, id_encomienda, creation_time, modification_time)
				VALUES('ENCOMIENDA CREADA', 'ENCOMIENDA CREADA', CURRENT_TIMESTAMP );

			  set respuestaOut = 'Encomienda creada exitosamente.';

		select respuestaOut;

	end;


CREATE PROCEDURE coordinadora.asignaEncomienda(
    IN idEncomiendaIN  BIGINT,
    IN idPlanillaIN  BIGINT ,
    OUT respuestaOut VARCHAR(500)
    )
	begin
		DECLARE existeEncomienda BIGINT;
		DECLARE idPlanilla BIGINT;
		DECLARE pesop DOUBLE;
		DECLARE pesoVehiculo DOUBLE;
		DECLARE pesoEncomienda DOUBLE;
		DECLARE valorEncomienda DOUBLE;

			  set respuestaOut = 'Error: .';
		SET existeEncomienda = (select count(*) from encomienda_planilla_viaje epv where epv.id_encomienda = idEncomiendaIN and epv.id_planilla_viaje =idPlanillaIN );

		IF (existeEncomienda = 0) then

			SET pesop = (select peso from planilla_viaje pv where pv.id =idPlanillaIN );
			SET pesoEncomienda = (select e.peso from encomienda e   where e.id =idEncomiendaIN );
			SET pesoVehiculo = (select v.peso from planilla_viaje pv inner join vehiculo v on v.id = pv.id_vehiculo where pv.id =idPlanillaIN );
			IF( (pesop + pesoEncomienda) > pesoVehiculo) then
			  set respuestaOut = 'Error: Se excede la capacidad del vehiculo.';
			else
				INSERT INTO coordinadora.encomienda_planilla_viaje (id_encomienda, id_planilla_viaje, creation_time)
				VALUES(idEncomiendaIN, idPlanillaIN, CURRENT_TIMESTAMP);

				INSERT INTO coordinadora.encomienda_planilla_viaje_historico
				(estado, descripcion, id_encomienda, id_planilla_viaje, creation_time)
				VALUES('SE ASIGNO LA ENCOMIENDA ', 'SE ASIGNO LA ENCOMIENDA ',idEncomiendaIN, idPlanillaIN, CURRENT_TIMESTAMP);


				UPDATE encomienda SET   id_planilla_viaje=idPlanillaIN WHERE id=idEncomiendaIN;

				SET valorEncomienda = (select e.valor_encomienda from encomienda e   where e.id =idEncomiendaIN );

				UPDATE planilla_viaje SET peso=(pesop + pesoEncomienda) , valor_viaje=(valor_viaje + valorEncomienda), cantidad_encomiendas=(cantidad_encomiendas+1)  WHERE id=idPlanillaIN;

			  set respuestaOut = 'Encomienda asignada exitosamente.';
			end if  ;
		else

			  set respuestaOut = 'Error: La encomienda ya esta asignada a la planilla de viaje';

		END if;
		select respuestaOut;

	end;

CREATE PROCEDURE coordinadora.despacharViaje(
    IN idPlanillaIN  BIGINT ,
    OUT respuestaOut VARCHAR(500)
    )
	begin


		 UPDATE planilla_viaje SET estado= 2, fecha_salida_real=CURRENT_TIMESTAMP WHERE id=idPlanillaIN;

		INSERT INTO coordinadora.planilla_viaje_historial (estado, descripcion, id_planilla_viaje, creation_time)
					VALUES('PLANILLA EN RUTA ', 'PLANILLA EN RUTA ', idPlanillaIN, CURRENT_TIMESTAMP);

		 UPDATE  encomienda e set e.estado =3 where e.id in(select epv.id_encomienda
		from encomienda_planilla_viaje epv where epv.id_planilla_viaje = idPlanillaIN) ;

			INSERT INTO coordinadora.encomienda_historial
				(estado, descripcion, id_encomienda, creation_time)
			  select 'ENCOMIENDA EN RUTA', 'ENCOMIENDA EN RUTA',e.id, CURRENT_TIMESTAMP
				 from encomienda as e
				where e.id in(select epv.id_encomienda from encomienda_planilla_viaje epv where epv.id_planilla_viaje = idPlanillaIN) ;



			  set respuestaOut = 'La planilla de viaje se encuentra en ruta';
		select respuestaOut;

	end;

CREATE PROCEDURE coordinadora.entregaEncomienda(
    IN idEncomiendaIN  BIGINT ,
    OUT respuestaOut VARCHAR(500)
    )
	begin

		 UPDATE  encomienda e set e.estado =4, fecha_entrega=CURRENT_TIMESTAMP  where e.id = idEncomiendaIN ;

			INSERT INTO coordinadora.encomienda_historial
				(estado, descripcion, id_encomienda, creation_time)
				VALUES('ENCOMIENDA ENTREGADA', 'ENCOMIENDA ENTREGADA',idEncomiendaIN, CURRENT_TIMESTAMP );


			  set respuestaOut = 'Encomienda entregada exitosamente';
		select respuestaOut;

	end;

	  CREATE VIEW consultaEnvioEncomiendasView AS

				SELECT e.id, e.peso, e.dimensiones, e.telefono, e.valor_declarado as valorDeclarado, e.valor_encomienda as valor,
                  e.cantidad_articulos as cantidad, e.direccion_envio as direccion,
                  e.coordenadas_envio as coordenada,
                   case e.estado
				        when 1 then 'Encomienda En Espera'
				        when 2 then 'Encomienda asignada a planilla de viaje'
				        when 3 then 'Encomienda En Transito'
				        when 4 then 'Encomienda Entregada'
				    end as estadoTexto,
                  e.estado,
                  e.notas, e.id_ciudad_origen as cidudadOrigen,
                  e.id_ciudad_destino as ciudadDestino, e.id_remitente as remitente,
                  e.id_destinatario as destinatario, e.id_tipo_mercancia as tipoMercancia,
                  e.id_tipo_servicio as tipoServicio, e.id_planilla_viaje as planillaViaje, c.nombre as ciudadOrigenNombre,
                  c2.nombre as ciudadDestinoNombre, tm.nombre as tipoMercanciaNombre,
                  ts.nombre as tipoServicioNombre, concat(p.nombres,' ',p.primer_apellido,' ',p.segundo_apellido) as nombreRemitente,
                  p.numero_documento as numeroDocumentoRemitente, concat(p2.nombres,' ',p2.primer_apellido,' ',p2.segundo_apellido) as nombreDestinatario,
                  p2.numero_documento as numeroDocumentoDestinatario, v.placa , v.conductor, v.id as idVehiculo, pv.fecha_salida_real as fechaDespacho
                 FROM coordinadora.encomienda e
                   inner join ciudad c on c.id = e.id_ciudad_origen
                   inner join ciudad c2 on c2.id = e.id_ciudad_destino
                   inner join tipo_mercancia tm   on tm.id = e.id_tipo_mercancia
                   inner join tipo_servicio ts  on ts.id = e.id_tipo_servicio
                   inner join persona p     on p.id = e.id_remitente
                   inner join persona p2   on p2.id = e.id_destinatario
                   inner join encomienda_planilla_viaje epv  on epv.id_encomienda = e.id
                   inner join planilla_viaje pv on pv.id = epv.id_planilla_viaje
                   inner join vehiculo v  on v.id = pv.id_vehiculo  ;
