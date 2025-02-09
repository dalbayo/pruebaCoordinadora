import { connection } from "../database/db.js";
import {ERRORES_HTTP} from "../utils/Errores.js";
import {fastifyRedis} from "@fastify/redis";




export const getCiudadesAll = async (request, reply) =>{
    try {
        /*const { redis } = fastifyRedis
        redis.get("getAllRutas", (err, val) => {
            /!*reply.send(err || val)*!/

            reply.status(ERRORES_HTTP["200"].code).send( val);
        })
*/

        const pagina = Number(request.params.pagina)
        let paginado=50
        const paginaInicia = paginado*pagina
        const paginaFinal = paginado*(pagina + 1)

        console.error("inicia getRutasAll ")
        let rutas  = [];

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                'select c.id, c.nombre , c.estado, d.id as idDepartamento, d.nombre as nombreDepartamento' +
                ' from ciudad c inner join departamento d on d.id = c.id_departamento limit  '+paginaInicia + ','+ paginaFinal,
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


