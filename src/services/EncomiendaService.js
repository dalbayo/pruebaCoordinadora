import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {ESTADOS_ENCOMIENDA} from "../utils/EstadoEncomienda.js"


/**
 * @description servicio de encomiendas
 * @route GET /ciudades/{pagina}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

/**
 * @description Obtiene una encomienda por su ID.
 * @route GET /encomiendas/{id}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getEncomiendaByIdService = async (id) => {
        let encomienda
        const promise = new Promise((resolve, reject) => {
            connection.query(
                "SELECT e.id, e.peso, e.dimensiones, e.telefono, e.valor_declarado as valorDeclarado, e.valor_encomienda as valor,   " +
                "  e.cantidad_articulos as cantidad, e.direccion_envio as direccion,   " +
                "  e.coordenadas_envio as coordenada, e.estado, e.notas, e.id_ciudad_origen as cidudadOrigen,  " +
                "  e.id_ciudad_destino as ciudadDestino, e.id_remitente as remitente,   " +
                "  e.id_destinatario as destinatario, e.id_tipo_mercancia as tipoMercancia,   " +
                "  e.id_tipo_servicio as tipoServicio, e.id_planilla_viaje as planillaViaje, c.nombre as ciudadOrigenNombre,  " +
                "  c2.nombre as ciudadDestinoNombre, tm.nombre as tipoMercanciaNombre,  " +
                "  ts.nombre as tipoServicioNombre, concat(p.nombres,' ',p.primer_apellido,' ',p.segundo_apellido) as nombreRemitente,  " +
                "  p.numero_documento as numeroDocumentoRemitente, concat(p2.nombres,' ',p2.primer_apellido,' ',p2.segundo_apellido) as nombreDestinatario,   " +
                "  p2.numero_documento as numeroDocumentoDestinatario  " +
                " FROM coordinadora.encomienda e    " +
                "   inner join ciudad c on c.id = e.id_ciudad_origen  " +
                "   inner join ciudad c2 on c2.id = e.id_ciudad_destino   " +
                "   inner join tipo_mercancia tm   on tm.id = e.id_tipo_mercancia   " +
                "   inner join tipo_servicio ts  on ts.id = e.id_tipo_servicio   " +
                "   inner join persona p     on p.id = e.id_remitente   " +
                "   inner join persona p2   on p2.id = e.id_destinatario   WHERE e.id = ?  limit 1 ", [id], async (error, results) => {

                    if (error) {
                        return error
                    }
                    encomienda = results
                    return resolve(results)
                })
        })
        const result = await promise
        return encomienda
}


/**
 * @description Crea una nueva encomienda.
 * @route POST /encomiendas
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const crearEncomiedaService = async (encuesta) => {
    try {

        let respuesta
        const promise = new Promise((resolve, reject) => {
            connection.query(
                " CALL coordinadora.createEncomienda(?,?,?,?, " +
                "?,?, ?,?," +
                "?,?, ?,?," +
                "?,?, ?,?, @resultado)   ",
                [encuesta.peso, encuesta.dimensiones, encuesta.telefono, encuesta.valorDeclarado,
                    encuesta.valorEncomienda, encuesta.cantidadArticulos, encuesta.direccion, encuesta.coordenadas,
                    ESTADOS_ENCOMIENDA.EN_ESPERA.code, encuesta.notas, encuesta.ciudadOrigen, encuesta.ciudadDestino,
                    encuesta.remitente, encuesta.destinatario, encuesta.tipoMercancia, encuesta.tipoServicio], async (error, results, fields) => {

                    if (error) {
                        return error
                    }
                    respuesta = results
                    return resolve(results)
                })
        })

        const result = await promise
        if (respuesta[0][0].respuestaOut.includes("Error:")) {
            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + respuesta[0][0].respuestaOut
            reply.status(errFormat.code).send({error: errFormat, response: null})
        } else if (respuesta[0][0].respuestaOut.includes("Encomienda creada exitosamente.")) {
            reply.status(ERRORES_HTTP["200"].code).send({error: null, response: respuesta[0][0].respuestaOut})
        } else {
            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + JSON.stringify(respuesta)
            reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
        }
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
    }
}


/**
 * @description Asigna una encomienda a una planilla de viaje.
 * @route POST /encomiendas/{idEncomienda}/planillas/{idPlanilla}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const asignarEncomiendaService = async (idEncomienda,idPlanilla) => {
        let respuesta
        const promise = new Promise((resolve, reject) => {
            connection.query(
                " CALL coordinadora.asignaEncomienda(?,?, @resultado)   ",
                [idEncomienda, idPlanilla], async (error, results, fields) => {

                    if (error) {
                        return error
                    }
                    respuesta = results
                    return resolve(results)
                })
        })

        const result = await promise
        return respuesta
}

/**
 * @description Marca una encomienda como entregada.
 * @route PUT /encomiendas/{id}/entrega
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const entregarEncomiendaService = async (id) => {
        let respuesta
        const primese = new Promise((resolve, reject) => {
            try {

                connection.query(
                    " CALL coordinadora.entregaEncomienda(? , @resultado)   ",
                    [id], async (error, results, fields) => {

                        if (error) {
                            return error
                        }
                        respuesta = results
                        return resolve(results)
                    })
            } catch (errerr) {

            }
        })
        const result = await primese
        return respuesta
}
/**
 * @description Consulta informes de encomiendas con filtros y paginación.
 * @route POST /encomiendas/informe
 * @param {Object} request - Objeto de solicitud de Fastify.  Se espera un body con los filtros:
 *   - fechaInicio (opcional): Fecha de inicio para el informe.
 *   - fechaFin (opcional): Fecha de fin para el informe.
 *   - vehiculo (opcional): ID del vehículo.
 *   - estado (opcional): Estado de la encomienda.
 *   - pagina (obligatorio): Número de página para la paginación.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const consultaInformeEncomiendaService = async (id, pagina, encuestaConsulta) => {
        let encomienda
        let where = ''
        let variables = []
        if (encuestaConsulta.fechaInicio) {
            where += " where ce.fechaDespacho >= ?"
            variables.push(encuestaConsulta.fechaInicio)
        }
        if (encuestaConsulta.fechaFin) {
            if (where.includes("where")) {
                where += " and ce.fechaDespacho <= ?"
                variables.push(encuestaConsulta.fechaFin)
            } else {
                where += " where ce.fechaDespacho <= ?"
                variables.push(encuestaConsulta.fechaFin)
            }
        }
        if (encuestaConsulta.vehiculo) {
            if (where.includes("where")) {
                where += " and ce.idVehiculo = ?"
                variables.push(encuestaConsulta.vehiculo)
            } else {
                where += " where ce.idVehiculo = ?"
                variables.push(encuestaConsulta.vehiculo)
            }
        }
        if (encuestaConsulta.estado) {
            if (where.includes("where")) {
                where += " and ce.estado = ?"
                variables.push(encuestaConsulta.estado)
            } else {
                where += " where ce.estado = ?"
                variables.push(encuestaConsulta.estado)
            }
        }
        let paginado = 50
        const paginaInicia = paginado * pagina

        const promise = new Promise((resolve, reject) => {
            connection.query(
                " select * from  consultaEnvioEncomiendasView ce   " + where + " limit  " + paginaInicia + "," + paginado,
                variables, async (error, results) => {
                    if (error) {
                        return error
                    }
                    encomienda = results
                    return resolve(results)
                })
        })

        const result = await promise
        return encomienda
}

/**
 * @description Consulta métricas de encomiendas por vehículo y estado, con filtros de fecha.
 * @route POST /encomiendas/metricas
 * @param {Object} request - Objeto de solicitud de Fastify. Se espera un body con los filtros:
 *   - fechaInicio (opcional): Fecha de inicio para el informe.
 *   - fechaFin (opcional): Fecha de fin para el informe.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const consultaInformeMetricasService = async (encuestaConsultaMetrica) => {
        let encomienda
        let where = ''
        let whereVehiculo = ''
        let variables = []
        if (encuestaConsultaMetrica.fechaInicio) {
            whereVehiculo += " and cv2.fechaDespacho >= ?"
            where += " where ce.fechaDespacho >= ?"
            variables.push(encuestaConsultaMetrica.fechaInicio)
        }
        if (encuestaConsultaMetrica.fechaFin) {
            if (where.includes("where")) {
                where += " and ce.fechaDespacho <= ?"
                whereVehiculo += " and cv2.fechaDespacho <= ?"
                variables.push(encuestaConsultaMetrica.fechaFin)
                if (encuestaConsultaMetrica.fechaInicio) {
                    variables.push(encuestaConsultaMetrica.fechaInicio)
                    variables.push(encuestaConsultaMetrica.fechaFin)
                }
            } else {
                where += " where ce.fechaDespacho <= ?"
                whereVehiculo += " and           cv2.fechaDespacho <= ?"
                variables.push(encuestaConsultaMetrica.fechaFin)
                variables.push(encuestaConsultaMetrica.fechaFin)
            }
        }
        const promise = new Promise((resolve, reject) => {
            connection.query(
                " select cm.estado, cm.estadoTexto, cm.cantidad, cm.total, (cm.cantidad/cm.total) as porcentaje , " +
                "cm.idVehiculo, cm.placa, cm.conductor " +
                " from ( " +
                "   select ce.estado, ce.estadoTexto, count(*) as cantidad,ce.idVehiculo, ce.placa, ce.conductor, " +
                "    (select count(*) from consultaenvioencomiendasview as cv2 where cv2.idVehiculo=ce.idVehiculo " + whereVehiculo + ")  as total  " +
                "   from consultaEnvioEncomiendasView ce " + where + " group by ce.idVehiculo, ce.estado, ce.estadoTexto " +
                " ) as cm       ",
                variables, async (error, results) => {
                    if (error) {
                        return error
                    }
                    encomienda = results
                    return resolve(results)
                })
        })
        const result = await promise
        return encomienda
}
