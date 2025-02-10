import { connection } from "../database/db.js";
import {ERRORES_HTTP} from "../utils/Errores.js";
import {fastifyRedis} from "@fastify/redis";
import {ESTADOS_VEHICULO} from "../utils/EstadoVehiculos.js";




export const getVehiculosAll = async (request, reply) =>{
    try {

        let resultado  = [];

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                'select * from vehiculo   ',
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


export const getVehiculoByIdActivo = async (id) =>{
    try {
        console.error("inicia getAllUsusarios ")
        let vehiculo;

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                'SELECT * from vehiculo WHERE  id = ?  limit 1 ', [id],async (error, results)=>{
                    // console.error(" inicia resul")
                    // console.log(results)
                    if(error){
                        console.error("inicia err")
                        console.log(error);
                    }
                    vehiculo = results;
                    return resolve(results);

                    // reply.status(200).send(usuarios)
                })
        });

        const promises =[promise1];
        const result = await Promise.all(promises);
        if(!vehiculo || vehiculo.estado !== ESTADOS_VEHICULO.ACTIVO.code){

            return null
        }
        return vehiculo;

    } catch (err) {
        console.error("error")
        console.error(err)
        return null;
    }
}


