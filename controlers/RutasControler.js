import { connection } from "../database/db.js";
import {ERRORES_HTTP} from "../utils/Errores.js";
import {fastifyRedis} from "@fastify/redis";


/**
 * @description Obtiene todas las rutas con información relacionada, con paginación.
 * @route GET /rutas/page/{pagina}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const getRutasAll = async (request, reply) =>{
    try {
        /*const { redis } = fastifyRedis
        redis.get("getAllRutas", (err, val) => {
            /!*reply.send(err || val)*!/

            reply.status(ERRORES_HTTP["200"].code).send( val);
        })
*/

        const pagina = Number(request.params.pagina)
        const paginado=50
        const paginaInicia = paginado*pagina

        console.error("inicia getRutasAll ")
        let rutas  = [];
        console.log('select r.id, r.nombre, r.descripcion, r.id_ciudad_origen as ciudadOrigen, c.nombre as nombreCiudadOrigen,  ' +
            '  r.id_ciudad_destino as ciudadDestino, c2.nombre as nombreCiudadDestino   ' +
            '  from ruta r   ' +
            '    inner join ciudad c on c.id =r.id_ciudad_origen    ' +
            '    inner join ciudad c2 on c2.id =r.id_ciudad_destino  limit  '+paginaInicia + ','+ paginado)
        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                'select r.id, r.nombre, r.descripcion, r.id_ciudad_origen as ciudadOrigen, c.nombre as nombreCiudadOrigen,  ' +
                '  r.id_ciudad_destino as ciudadDestino, c2.nombre as nombreCiudadDestino   ' +
                '  from ruta r   ' +
                '    inner join ciudad c on c.id =r.id_ciudad_origen    ' +
                '    inner join ciudad c2 on c2.id =r.id_ciudad_destino  limit  '+paginaInicia + ','+ paginado,
                async (error, results)=>{
                    // console.error(" inicia resul")
                    // console.log(results)
                    if(error){
                        console.error("inicia err")
                        console.log(error);
                    }
                    rutas = results;
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
        /*redis.set("getAllRutas",{error:null,response:rutas}, (err) => {
            reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:rutas});
        })*/
       reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:rutas});

    } catch (err) {
        console.error("error")
        console.error(err)
        let errFormat = ERRORES_HTTP["500"];
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null});
    }
}


