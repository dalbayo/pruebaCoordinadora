import { connection } from "../database/db.js";
import {ERRORES_HTTP} from "../utils/Errores.js";
import {fastifyRedis} from "@fastify/redis";


/**
 * @description Obtiene todas las rutas principales con información relacionada, con paginación.
 * @route GET /rutas-principales/page/{pagina}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const getRutasPrincipalesAll = async (request, reply) =>{
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

        console.error("inicia getRutasPrincipalesAll ")
        let rutas  = [];

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                'select rp.id, rp.nombre, rp.descripcion, rp.id_ciudad_origen as ciudadOrigen, c.nombre as nombreCiudadOrigen, ' +
                ' rp.id_ciudad_destino as ciudadDestino, c2.nombre as nombreCiudadDestino  ' +
                ' from ruta_principal rp  ' +
                '  inner join ciudad c on c.id =rp.id_ciudad_origen   ' +
                '  inner join ciudad c2 on c2.id =rp.id_ciudad_destino  limit  '+paginaInicia + ','+ paginado,
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

/**
 * @description Obtiene una ruta principal por su ID, incluyendo las rutas secundarias relacionadas.
 * @route GET /rutas-principales/{id}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const getRutaPrincipalById = async (request, reply) =>{
    try {
        const id = Number(request.params.id)
        console.error("inicia getRutaPrincipalById ")
        let rutaPrincipal;

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(

                'select rp.id, rp.nombre, rp.descripcion, rp.id_ciudad_origen as ciudadOrigen, c.nombre as nombreCiudadOrigen, ' +
                ' rp.id_ciudad_destino as ciudadDestino, c2.nombre as nombreCiudadDestino  ' +
                ' from ruta_principal rp  ' +
                '  inner join ciudad c on c.id =rp.id_ciudad_origen   ' +
                '  inner join ciudad c2 on c2.id =rp.id_ciudad_destino   where   rp.id = ?  limit 1 ', [id],async (error, results)=>{
                    // console.error(" inicia resul")
                    // console.log(results)
                    if(error){
                        console.error("inicia err")
                        console.log(error);
                    }
                    rutaPrincipal = results;
                    return resolve(results);

                })
        });


        console.error("getRutasSecundariasByIdPrincipal")
        // inicia consulta sub rutas
        console.error("inicia getRutasSecundariasByIdPrincipal ")
        let rutasSecundarias  = [];

        const promise1S =  new Promise((resolve, reject)=>{
            connection.query(
                'select rs.id, rs.nombre, rs.id_ruta as ruta, orden from ruta_secundaria rs where rs.id_ruta_principal =? order by orden  ' ,[id],
                async (error, results)=>{
                     console.error(" ruta_secundaria resul")
                    // console.log(results)
                    if(error){
                        console.error("inicia err")
                        console.log(error);
                    }
                    console.log(results);
                    rutasSecundarias = results;
                    return resolve(results);

                    // reply.status(200).send(usuarios)
                })
        });

        const promises =[promise1,promise1S];
        const result = await Promise.all(promises);
        if(!rutaPrincipal){

            let errFormat = ERRORES_HTTP["500"];
            errFormat.description = errFormat.description + " No existe la ruta"
            reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null});
        }

        /*const promisesS =[promise1S];
        console.log("llego promis2e")
        const resultS = Promise.all(promisesS);*/
        /* console.log("llego promise")
         console.log(ERRORES_HTTP["200"].code)
         console.log({error:null,response:rutas})*/
        /*redis.set("getAllRutas",{error:null,response:rutas}, (err) => {
            reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:rutas});
        })*/
        console.error("rutasSecundarias")
        console.error(rutasSecundarias)
        // fin consulta subRutas
        console.error("rutasSecundarias")
        console.error(rutasSecundarias)
        console.error("getRutasSecundariasByIdPrincipal2")
        console.error(rutaPrincipal)
        console.error("getRutasSecundariasByIdPrincipal3")
        rutaPrincipal[0]['rutasSecundarias'] = rutasSecundarias
        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:rutaPrincipal});
    } catch (err) {
        console.error("error")
        console.error(err)
        let errFormat = ERRORES_HTTP["500"];
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null});
    }
}

