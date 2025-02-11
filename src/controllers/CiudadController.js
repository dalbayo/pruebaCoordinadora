import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {fastifyRedis} from "@fastify/redis"
import {getCiudadesServiceAll} from "../services/CiudadService.js";

/**
 * @description controlador de ciudades
 * @route GET /ciudades/{pagina}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */


/**
 * @description Obtiene todas las ciudades con paginación.
 * @route GET /ciudades/{pagina}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getCiudadesAll = async (request, reply) => {
    try {
        const pagina = Number(request.params.pagina)
        let rutas = await getCiudadesServiceAll(pagina)
        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: rutas})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
    }
}


