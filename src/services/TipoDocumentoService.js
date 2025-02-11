import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {fastifyRedis} from "@fastify/redis"


/**
 * @description Obtiene todos los tipos de documento.
 * @route GET /tipos-documento
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getTipoDocumentosAllService = async () => {
    let resultado = []

    const promise = new Promise((resolve, reject) => {
        connection.query(
            'select * from tipo_documento   ',
            async (error, results) => {
                if (error) {
                    return error
                }
                resultado = results
                return resolve(results)

            })
    })

    const result = await promise
    return resultado
}


