import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {ESTADOS_ENCOMIENDA} from "../utils/EstadoEncomienda.js"
import {
    asignarEncomiendaService, consultaInformeEncomiendaService, consultaInformeMetricasService,
    crearEncomiedaService, entregarEncomiendaService,
    getEncomiendaByIdService
} from "../services/EncomiendaService.js";


/**
 * @description controlador de encomiendas
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
export const getEncomiendaById = async (request, reply) => {
    try {
        const id = Number(request.params.id)
        let encomienda = await getEncomiendaByIdService(id);
        if (!encomienda) {

            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + " No existe la encomienda"
            reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
        } else {
            reply.status(ERRORES_HTTP["200"].code).send({error: null, response: encomienda})
        }

    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
    }
}


/**
 * @description Crea una nueva encomienda.
 * @route POST /encomiendas
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const crearEncomieda = async (request, reply) => {
    try {
        let encuesta = request.body
        let respuesta = await crearEncomiedaService(encuesta);

        console.log("respuesta")
        console.log(respuesta)
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
        console.log("err")
        console.log("err")
        console.log(err)
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

export const asignarEncomienda = async (request, reply) => {
    try {
        const idEncomienda = Number(request.params.idEncomienda)
        const idPlanilla = Number(request.params.idPlanilla)
        let respuesta = await asignarEncomiendaService(idEncomienda, idPlanilla)
        if (respuesta[0][0].respuestaOut.includes("Error:")) {
            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + respuesta[0][0].respuestaOut
            reply.status(errFormat.code).send({error: errFormat, response: null})
        } else if (respuesta[0][0].respuestaOut.includes("Encomienda asignada exitosamente.")) {
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
 * @description Marca una encomienda como entregada.
 * @route PUT /encomiendas/{id}/entrega
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const entregarEncomienda = async (request, reply) => {
    try {
        const id = Number(request.params.id)
        let respuesta = await entregarEncomiendaService(id)
        if (respuesta[0][0].respuestaOut.includes("Error:")) {
            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + respuesta[0][0].respuestaOut
            reply.status(errFormat.code).send({error: errFormat, response: null})
        } else if (respuesta[0][0].respuestaOut.includes("Encomienda entregada exitosamente")) {
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

export const consultaInformeEncomienda = async (request, reply) => {
    try {
        const id = Number(request.params.id)
        const pagina = Number(request.body.pagina)
        const encuesta = request.body
        const encomienda = await consultaInformeEncomiendaService(id, pagina, encuesta)
        if (!encomienda) {
            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + " No existe la encomienda"
            reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
        } else {
            reply.status(ERRORES_HTTP["200"].code).send({error: null, response: encomienda})
        }

    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
    }
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
export const consultaInformeMetricas = async (request, reply) => {
    try {
        const encuestaConsultaMetrica = request.body
        const encomienda = await consultaInformeMetricasService(encuestaConsultaMetrica)
        if (!encomienda) {

            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + " No existe la encomienda"
            reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
        } else {
            reply.status(ERRORES_HTTP["200"].code).send({error: null, response: encomienda})
        }

    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
    }
}
