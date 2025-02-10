import { connection } from "../database/db.js";
import {ERRORES_HTTP} from "../utils/Errores.js";
import {fastifyRedis} from "@fastify/redis";



/**
 * @description Obtiene todos los tipos de documento.
 * @route GET /tipos-documento
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getTipoDocumentosAll = async (request, reply) =>{
    try {

        let resultado  = [];

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                'select * from tipo_documento   ',
                async (error, results)=>{
                    // console.error(" inicia resul")
                    // console.log(results)
                    if(error){
                        console.error("inicia err")
                        console.log(error);
                    }
                    resultado = results;
                    return resolve(results);

                    // reply.status(200).send(usuarios)
                })
        });

        const promises =[promise1];
        console.log("llego promis2e")
        const result = await Promise.all(promises);
       /* console.log("llego promise")
        console.log(ERRORES_HTTP["200"].code)
        console.log({error:null,response:rutas})*/
        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:resultado});

    } catch (err) {
        console.error("error")
        console.error(err)
        let errFormat = ERRORES_HTTP["500"];
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null});
    }
}


