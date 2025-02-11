import { connection } from "../database/db.js"
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


export const getVehiculosAll = async (request, reply) =>{
    try {

        let resultado  = []

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                'select * from vehiculo   ',
                async (error, results)=>{
                    if(error){
                        return error
                    }
                    resultado = results
                    return resolve(results)

                    // reply.status(200).send(usuarios)
                })
        })

        const promises =[promise1]
        const result = await Promise.all(promises)

        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:resultado})

    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
    }
}


/**
 * @description Obtiene un vehículo por su ID si está activo.
 * @param {number} id - El ID del vehículo.
 * @returns {Promise<object|null>} - Un objeto con los datos del vehículo si existe y está activo, o null si no.
 * @author Daniel Barrera
 */
export const getVehiculoByIdActivo = async (id) =>{
    try {
        let vehiculo

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                'SELECT * from vehiculo WHERE  id = ?  limit 1 ', [id],async (error, results)=>{
                    // console.error(" inicia resul")
                    // console.log(results)
                    if(error){
                        return error
                    }
                    vehiculo = results
                    return resolve(results)

                    // reply.status(200).send(usuarios)
                })
        })

        const promises =[promise1]
        const result = await Promise.all(promises)
        if(!vehiculo || vehiculo.estado !== ESTADOS_VEHICULO.ACTIVO.code){

            return null
        }
        return vehiculo

    } catch (err) {
        return null
    }
}


