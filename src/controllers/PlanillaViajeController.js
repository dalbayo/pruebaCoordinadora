import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {getVehiculoByIdActivo} from "./VehiculoController.js"
import {ESTADOS_PLANILLA} from "../utils/EstadoPlanillaViaje.js"
import {ESTADOS_VEHICULO} from "../utils/EstadoVehiculos.js"
import {
    createPlanillaViajeService, despacharPlanillaDeViajeService,
    getPlanillasViajeAllService,
    getPlanillaViajeByIdService
} from "../services/PlanillaViajeService.js";

/**
 * @description Obtiene todas las planillas de viaje con información relacionada, con paginación.
 * @route GET /planillas/page/{pagina}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const getPlanillasViajeAll = async (request, reply) => {
    try {

        const pagina = Number(request.params.pagina)
        let paginado = 50
        const paginaInicia = paginado * pagina
        let planillasViajes = await getPlanillasViajeAllService(pagina)
        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: planillasViajes})

    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
    }
}

/**
 * @description Obtiene una planilla de viaje por su ID.
 * @route GET /planillas/{id}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getPlanillaViajeById = async (request, reply) => {
    try {
        const id = Number(request.params.id)
        let planillaViaje = await getPlanillaViajeByIdService(id)
        if (!planillaViaje) {

            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + " No existe la planillaViaje"
            reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
        }

        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: planillaViaje})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
    }
}


/**
 * @description Crea una nueva planilla de viaje.
 * @route POST /planillas
 * @param {Object} request - Objeto de solicitud de Fastify. Se espera un body con los datos de la planilla:
 *   - peso (obligatorio)
 *   - valorViaje (obligatorio)
 *   - cantidadEncomiendas (obligatorio)
 *   - notas (opcional)
 *   - fechaSalida (obligatorio)
 *   - fechaFinEstimada (obligatorio)
 *   - rutaPrincipal (obligatorio)
 *   - vehiculo (obligatorio)
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const createPlanillaViaje = async (request, reply) => {
    try {
        const planillaViaje = request.body
        let respuesta = await createPlanillaViajeService(planillaViaje)
        if (respuesta[0][0].respuestaOut.includes("Error:")) {
            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + respuesta[0][0].respuestaOut
            reply.status(errFormat.code).send({error: errFormat, response: null})
        } else if (respuesta[0][0].respuestaOut.includes("Planilla de viaje creada exitosamente.")) {
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
 * @description Marca una planilla de viaje como despachada (en ruta).
 * @route PUT /planillas/{id}/despacho
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const despacharPlanillaDeViaje = async (request, reply) => {
    try {
        const id = Number(request.params.id)
        let respuesta = await despacharPlanillaDeViajeService(id)
        if (respuesta[0][0].respuestaOut.includes("Error:")) {
            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + respuesta[0][0].respuestaOut
            reply.status(errFormat.code).send({error: errFormat, response: null})
        } else if (respuesta[0][0].respuestaOut.includes("La planilla de viaje se encuentra en ruta")) {
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

