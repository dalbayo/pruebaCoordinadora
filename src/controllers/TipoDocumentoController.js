import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {fastifyRedis} from "@fastify/redis"
import {getTipoDocumentosAllService} from "../services/TipoDocumentoService.js";


/**
 * @description Obtiene todos los tipos de documento.
 * @route GET /tipos-documento
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getTipoDocumentosAll = async (request, reply) => {
    try {

        let resultado = await  getTipoDocumentosAllService()

        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: resultado})

    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
    }
}


