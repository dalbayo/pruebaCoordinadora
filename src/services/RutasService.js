import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {fastifyRedis} from "@fastify/redis"


/**
 * @description Obtiene todas las rutas con información relacionada, con paginación.
 * @route GET /rutas/page/{pagina}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const getRutasAllService = async (pagina) => {
    const paginado = 200
    const paginaInicia = paginado * pagina

    let rutas = []
    const promise = new Promise((resolve, reject) => {
        connection.query(
            'select r.id, r.nombre, r.descripcion, r.id_ciudad_origen as ciudadOrigen, c.nombre as nombreCiudadOrigen,  ' +
            '  r.id_ciudad_destino as ciudadDestino, c2.nombre as nombreCiudadDestino   ' +
            '  from ruta r   ' +
            '    inner join ciudad c on c.id =r.id_ciudad_origen    ' +
            '    inner join ciudad c2 on c2.id =r.id_ciudad_destino  limit  ' + paginaInicia + ',' + paginado,
            async (error, results) => {
                if (error) {
                    return error
                }
                rutas = results
                return resolve(results)
            })
    })
    const result = await promise
    return rutas
}


