import { connection } from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {fastifyRedis} from "@fastify/redis"

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
export const getCiudadesAll = async (request, reply) =>{
    try {


        const pagina = Number(request.params.pagina)
        let paginado=50
        const paginaInicia = paginado*pagina

        let rutas  = []

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                'select c.id, c.nombre , c.estado, d.id as idDepartamento, d.nombre as nombreDepartamento, c.creation_time' +
                ' from ciudad c inner join departamento d on d.id = c.id_departamento limit  '+paginaInicia + ','+ paginado,
                async (error, results)=>{
                    if(error){
                        return error
                    }
                    rutas = results
                    return resolve(results)
                })
        })

        const promises =[promise1]
        const result = await Promise.all(promises)

        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:rutas})

    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
    }
}


