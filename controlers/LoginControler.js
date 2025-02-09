import { connection } from "../database/db.js";
import {fastify, validTokens} from "../server.js";
import {ERRORES_HTTP} from "../utils/Errores.js";



export const loginUsuario = async (request, reply) =>{
    try {/*
        console.log(request.body)
        //const id = Number(request.params.id)
        console.error("inicia updateUsuario ")*/
        const id = Number(request.params.id)
        /*  console.log("inicia validacion")*/
        /*
                console.log(id)*/
        // valida existencia del usuario
        let usuario;

        const promiseV =  new Promise((resolve, reject)=>{
            connection.query(
                'SELECT u.id ,u.nombres, u.primer_apellido  as primerApelllido, u.segundo_apellido as segundoApellido, ' +
                '  u.correo, u.id_perfil, p.nombre as nombrePerfil FROM usuario u inner join perfil p on p.id =u.id_perfil ' +
                '  WHERE u.correo = ? and u.clave= SHA2(?, 224)  limit 1 ', [request.body.correo, request.body.clave],async (error, results)=>{
                    // console.error(" inicia resul")
                    // console.log(results)
                    if(error){
                        console.error("inicia err")
                        console.log(error);
                    }
                    usuario = results;
                    return resolve(results);

                    // reply.status(200).send(usuarios)
                })
        });

        const promisesv =[promiseV];
        const resultv = await Promise.all(promisesv);
        console.log(usuario)
        if(!usuario){
            let errFormat = ERRORES_HTTP["500"];
            errFormat.description = errFormat.description + "El usuario no es valido"
            reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null});
        }
        const token = fastify.jwt.sign({ usuario })
        usuario[0]['token'] = token
        validTokens.set(token,usuario[0])
        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:usuario});
        //reply.status(200).send(usuario)
    } catch (err) {
        console.error("error")
        console.error(err)
        let errFormat = ERRORES_HTTP["500"];
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null});
    }
}


export const logout = async (request, reply) =>{
    if(true){
        return true;
    }
    const { authorization } = req.headers;
    /* console.log("authorization")
     console.log(authorization)*/


    try {

        validTokens.forEach((v)=>{
            if(v.token === authorization){
                validTokens.delete(authorization)
            }
        });
        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:"Se ha cerrado la sesión"});

    } catch (err) {
        return false;
    }
}


