import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {fastifyRedis} from "@fastify/redis"


/**
 * @description Obtiene todas las rutas principales con información relacionada, con paginación.
 * @route GET /rutas-principales/page/{pagina}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const getRutasPrincipalesAllService = async (pagina) => {
    const paginado = 50
    const paginaInicia = paginado * pagina

    let rutas = []

    const promise = new Promise((resolve, reject) => {
        connection.query(
            'select rp.id, rp.nombre, rp.descripcion, rp.id_ciudad_origen as ciudadOrigen, c.nombre as nombreCiudadOrigen, ' +
            ' rp.id_ciudad_destino as ciudadDestino, c2.nombre as nombreCiudadDestino  ' +
            ' from ruta_principal rp  ' +
            '  inner join ciudad c on c.id =rp.id_ciudad_origen   ' +
            '  inner join ciudad c2 on c2.id =rp.id_ciudad_destino  limit  ' + paginaInicia + ',' + paginado,
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

/**
 * @description Obtiene una ruta principal por su ID, incluyendo las rutas secundarias relacionadas.
 * @route GET /rutas-principales/{id}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const getRutaPrincipalByIdService = async (id) => {
    let rutaPrincipal

    const promise = new Promise((resolve, reject) => {
        connection.query(
            'select rp.id, rp.nombre, rp.descripcion, rp.id_ciudad_origen as ciudadOrigen, c.nombre as nombreCiudadOrigen, ' +
            ' rp.id_ciudad_destino as ciudadDestino, c2.nombre as nombreCiudadDestino  ' +
            ' from ruta_principal rp  ' +
            '  inner join ciudad c on c.id =rp.id_ciudad_origen   ' +
            '  inner join ciudad c2 on c2.id =rp.id_ciudad_destino   where   rp.id = ?  limit 1 ', [id], async (error, results) => {

                if (error) {
                    return error
                }
                rutaPrincipal = results
                return resolve(results)

            })
    })


    // inicia consulta sub rutas
    let rutasSecundarias = []

    const promiseS = new Promise((resolve, reject) => {
        connection.query(
            'select rs.id, rs.nombre, rs.id_ruta as ruta, orden from ruta_secundaria rs where rs.id_ruta_principal =? order by orden  ', [id],
            async (error, results) => {
                if (error) {
                    return error
                }
                rutasSecundarias = results
                return resolve(results)
            })
    })

    const promises =[promise,promiseS];
    const result = await Promise.all(promises);
    if (!rutaPrincipal) {
        return rutaPrincipal
    }
    rutaPrincipal[0]['rutasSecundarias'] = rutasSecundarias
    return rutaPrincipal
}

