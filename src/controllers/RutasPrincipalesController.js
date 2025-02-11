import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {fastifyRedis} from "@fastify/redis"
import {getRutaPrincipalByIdService, getRutasPrincipalesAllService} from "../services/RutasPrincipalesService.js";


/**
 * @description Obtiene todas las rutas principales con información relacionada, con paginación.
 * @route GET /rutas-principales/page/{pagina}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const getRutasPrincipalesAll = async (request, reply) => {
    try {
        /*const { redis } = fastifyRedis
        redis.get("getAllRutas", (err, val) => {
            /!*reply.send(err || val)*!/

            reply.status(ERRORES_HTTP["200"].code).send( val)
        })
*/

        const pagina = Number(request.params.pagina)

        let rutas = await getRutasPrincipalesAllService(pagina)
        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: rutas})

    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
    }
}

/**
 * @description Obtiene una ruta principal por su ID, incluyendo las rutas secundarias relacionadas.
 * @route GET /rutas-principales/{id}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const getRutaPrincipalById = async (request, reply) => {
    try {
        const id = Number(request.params.id)
        let rutaPrincipal = await getRutaPrincipalByIdService(id)
        if (!rutaPrincipal) {

            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + " No existe la ruta"
            reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
        }

        // fin consulta subRutas

        rutaPrincipal[0]['rutasSecundarias'] = rutasSecundarias
        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: rutaPrincipal})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
    }
}

