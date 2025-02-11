import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {fastifyRedis} from "@fastify/redis"
import {ESTADOS_VEHICULO} from "../utils/EstadoVehiculos.js"


/**
 * @description Obtiene todos los vehículos.
 * @route GET /vehiculos
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */


export const getVehiculosAllService = async () => {
        let resultado = []

        const promise = new Promise((resolve, reject) => {
            connection.query(
                'select * from vehiculo   ',
                async (error, results) => {
                    if (error) {
                        return error
                    }
                    resultado = results
                    return resolve(results)
                })
        })

        const result = await promise
}


/**
 * @description Obtiene un vehículo por su ID si está activo.
 * @param {number} id - El ID del vehículo.
 * @returns {Promise<object|null>} - Un objeto con los datos del vehículo si existe y está activo, o null si no.
 * @author Daniel Barrera
 */
export const getVehiculoByIdActivoService = async (id) => {
    try {
        let vehiculo

        const promise = new Promise((resolve, reject) => {
            connection.query(
                'SELECT * from vehiculo WHERE  id = ?  limit 1 ', [id], async (error, results) => {
                    if (error) {
                        return error
                    }
                    vehiculo = results
                    return resolve(results)
                })
        })

        const result = await promise
        return vehiculo

    } catch (err) {
        return null
    }
}


