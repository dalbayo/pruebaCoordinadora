import { connection } from "../database/db.js";
import {ERRORES_HTTP} from "../utils/Errores.js";
import {getVehiculoByIdActivo} from "./VehiculoControler.js";
import {ESTADOS_PLANILLA} from "../utils/EstadoPlanillaViaje.js";
import {ESTADOS_VEHICULO} from "../utils/EstadoVehiculos.js";

/**
 * @description Obtiene todas las planillas de viaje con información relacionada, con paginación.
 * @route GET /planillas/page/{pagina}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const getPlanillasViajeAll = async (request, reply) =>{
    try {
        console.error("inicia getPlanillasViajeAll ")

        const pagina = Number(request.params.pagina)
        let paginado=50
        const paginaInicia = paginado*pagina
        let planillasViajes  = [];

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                "SELECT  pv.id, pv.peso, pv.valor_viaje as valorViaje, pv.cantidad_encomiendas as cantidadEncomiendas, " +
                "  pv.notas, pv.estado,  pv.fecha_salida as fechaSalida, pv.fecha_fin_estimada as fechaFinEstimada, pv.ruta_principal as rutaPrincipal, " +
                "  pv.id_vehiculo as vehiculo,   v.placa, v.conductor, v.peso, rp.nombre nombreRutaPrincipal,  " +
                "  rp.id_ciudad_origen as ciudadOrigen, c.nombre ciudadOrigen, d.nombre as departamentoOrigen, " +
                "  rp.id_ciudad_destino as ciudadDestino, c2.nombre ciudadDestino, d2.nombre as departamentoDestino   " +
                "FROM planilla_viaje pv inner join vehiculo v on v.id =pv.id_vehiculo " +
                " inner join ruta_principal rp on rp.id =pv.ruta_principal " +
                " inner join ciudad c on c.id = rp.id_ciudad_origen inner join ciudad c2 on c2.id = rp.id_ciudad_destino " +
                " inner join departamento d  on d.id = c.id_departamento inner join departamento d2  " +
                "on d2.id = c2.id_departamento limit  "+paginaInicia + ","+ paginado+" ;",
                async (error, results)=>{
                    // console.error(" inicia resul")
                    // console.log(results)
                    if(error){
                        console.error("inicia err")
                        console.log(error);
                    }
                    planillasViajes = results;
                    return resolve(results);

                    // reply.status(200).send(planillasViajes)
                })
        });

        const promises =[promise1];
        const result = await Promise.all(promises);
        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:planillasViajes});

    } catch (err) {
        console.error("error")
        console.error(err)
        let errFormat = ERRORES_HTTP["500"];
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null});
    }
}

/**
 * @description Obtiene una planilla de viaje por su ID.
 * @route GET /planillas/{id}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getPlanillaViajeById = async (request, reply) =>{
    try {
        const id = Number(request.params.id)
        console.error("inicia getPlanillaViajeById ")
        let planillaViaje;

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(

                "SELECT  pv.id, pv.peso, pv.valor_viaje as valorViaje, pv.cantidad_encomiendas as cantidadEncomiendas, " +
                "  pv.notas, pv.estado,  pv.fecha_salida as fechaSalida, pv.fecha_fin_estimada as fechaFinEstimada, pv.ruta_principal as rutaPrincipal, " +
                "  pv.id_vehiculo as vehiculo,   v.placa, v.conductor, v.peso, rp.nombre nombreRutaPrincipal,  " +
                "  rp.id_ciudad_origen as ciudadOrigen, c.nombre ciudadOrigen, d.nombre as departamentoOrigen, " +
                "  rp.id_ciudad_destino as ciudadDestino, c2.nombre ciudadDestino, d2.nombre as departamentoDestino   " +
                "FROM planilla_viaje pv inner join vehiculo v on v.id =pv.id_vehiculo " +
                " inner join ruta_principal rp on rp.id =pv.ruta_principal " +
                " inner join ciudad c on c.id = rp.id_ciudad_origen inner join ciudad c2 on c2.id = rp.id_ciudad_destino " +
                " inner join departamento d  on d.id = c.id_departamento inner join departamento d2  " +
                "on d2.id = c2.id_departamento where pv.id=?   limit 1 ", [id],async (error, results)=>{
                    // console.error(" inicia resul")
                    // console.log(results)
                    if(error){
                        console.error("inicia err")
                        console.log(error);
                    }
                    planillaViaje = results;
                    return resolve(results);

                    // reply.status(200).send(planillasViajes)
                })
        });

        const promises =[promise1];
        const result = await Promise.all(promises);
        if(!planillaViaje){

            let errFormat = ERRORES_HTTP["500"];
            errFormat.description = errFormat.description + " No existe la planillaViaje"
            reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null});
        }

        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:planillaViaje});
    } catch (err) {
        console.error("error")
        console.error(err)
        let errFormat = ERRORES_HTTP["500"];
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null});
    }
}



/**
 * @description Crea una nueva planilla de viaje.
 * @route POST /planillas
 * @param {Object} request - Objeto de solicitud de Fastify. Se espera un body con los datos de la planilla:
 *   - peso (obligatorio)
 *   - valorViaje (obligatorio)
 *   - cantidadEncomiendas (obligatorio)
 *   - notas (opcional)
 *   - fechaSalida (obligatorio)
 *   - fechaFinEstimada (obligatorio)
 *   - rutaPrincipal (obligatorio)
 *   - vehiculo (obligatorio)
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const createPlanillaViaje = async (request, reply) =>{
    try {

        console.error("inicia createPlanillaViaje ")

        let respuesta;

        const promise1 =  new Promise((resolve, reject)=>{
            try{

                connection.query(
                    " CALL coordinadora.createPlanillaViaje(?,?,?,?, " +
                    "?,?," +
                    "?,?," +
                    "?,?, @resultado) ;  ",
                    [request.body.peso,request.body.valorViaje,request.body.cantidadEncomiendas,request.body.notas
                        ,ESTADOS_PLANILLA.CREADO.code,ESTADOS_VEHICULO.ACTIVO.code,
                        request.body.fechaSalida, request.body.fechaFinEstimada,
                        request.body.rutaPrincipal, request.body.vehiculo],async (error, results,fields)=>{

                        if(error){
                            console.error("inicia err")
                            console.log(error);
                        }
                        respuesta = results;
                        return resolve(results);

                        // reply.status(200).send(planillasViajes)
                    })
            }catch (errerr){

                console.error("errerrerrerr")
                console.error(err)
            }
        });

        const promises =[promise1];
        const result = await Promise.all(promises);
        if(respuesta[0][0].respuestaOut.includes("Error:")){
            let errFormat = ERRORES_HTTP["500"];
            errFormat.description = errFormat.description + respuesta[0][0].respuestaOut
            reply.status(errFormat.code).send( {error:errFormat,response:null});
        }else  if(respuesta[0][0].respuestaOut.includes("Planilla de viaje creada exitosamente.")){
            reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:respuesta[0][0].respuestaOut});
        }else {
            let errFormat = ERRORES_HTTP["500"];
            errFormat.description = errFormat.description + JSON.stringify(respuesta)
            reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null});
        }
    } catch (err) {
        console.error("error")
        console.error(err)
        let errFormat = ERRORES_HTTP["500"];
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null});
    }
}



/**
 * @description Marca una planilla de viaje como despachada (en ruta).
 * @route PUT /planillas/{id}/despacho
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const despacharPlanillaDeViaje = async (request, reply) =>{
    try {

        console.error("inicia despacharPlanillaDeViaje ")
        const id = Number(request.params.id)

        let respuesta;



        const promise1 =  new Promise((resolve, reject)=>{
            try{

                connection.query(
                    " CALL coordinadora.despacharViaje(? , @resultado) ;  ",
                    [id],async (error, results,fields)=>{

                        if(error){
                            console.error("inicia err")
                            console.log(error);
                        }
                        respuesta = results;
                        return resolve(results);

                        // reply.status(200).send(planillasViajes)
                    })
            }catch (errerr){

                console.error("errerrerrerr")
                console.error(err)
            }
        });

        const promises =[promise1];
        const result = await Promise.all(promises);
        if(respuesta[0][0].respuestaOut.includes("Error:")){
            let errFormat = ERRORES_HTTP["500"];
            errFormat.description = errFormat.description + respuesta[0][0].respuestaOut
            reply.status(errFormat.code).send( {error:errFormat,response:null});
        }else  if(respuesta[0][0].respuestaOut.includes("La planilla de viaje se encuentra en ruta")){
            reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:respuesta[0][0].respuestaOut});
        }else {
            let errFormat = ERRORES_HTTP["500"];
            errFormat.description = errFormat.description + JSON.stringify(respuesta)
            reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null});
        }
    } catch (err) {
        console.error("error")
        console.error(err)
        let errFormat = ERRORES_HTTP["500"];
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null});
    }
}

