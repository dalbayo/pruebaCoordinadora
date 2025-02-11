import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {fastifyRedis} from "@fastify/redis"


/**
 * @description servicio de perfiles
 * @route GET /login/
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

/**
 * @description Obtiene todos los perfiles.
 * @route GET /perfiles
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const getPerfilesAllService = async () => {
    let resultado = []

    const promise = new Promise((resolve, reject) => {
        connection.query(
            'select * from perfil   ',
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


