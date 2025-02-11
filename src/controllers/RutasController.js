import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {fastifyRedis} from "@fastify/redis"
import {getRutasAllService} from "../services/RutasService.js";


/**
 * @description Obtiene todas las rutas con información relacionada, con paginación.
 * @route GET /rutas/page/{pagina}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const getRutasAll = async (request, reply) => {
    try {
        const pagina = Number(request.params.pagina)
        const paginado = 50
        const paginaInicia = paginado * pagina

        let rutas = await getRutasAllService(pagina)
        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: rutas})

    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
    }
}


