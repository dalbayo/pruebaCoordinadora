import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {fastifyRedis} from "@fastify/redis"

/**
 * @description serivicio de ciudades
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
export const getCiudadesServiceAll = async (pagina) => {
        let paginado = 50
        const paginaInicia = paginado * pagina
        let rutas = []

        const promise1 = new Promise((resolve, reject) => {
            connection.query(
                'select c.id, c.nombre , c.estado, d.id as idDepartamento, d.nombre as nombreDepartamento, c.creation_time' +
                ' from ciudad c inner join departamento d on d.id = c.id_departamento limit  ' + paginaInicia + ',' + paginado,
                async (error, results) => {
                    if (error) {
                        return error
                    }
                    rutas = results
                    return resolve(results)
                })
        })

        const promises = [promise1]
        const result = await Promise.all(promises)
        return rutas
}


