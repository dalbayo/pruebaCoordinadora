import { connection } from "../database/db.js"
import {fastify, validTokens} from "../../server.js"
import {ERRORES_HTTP} from "../utils/Errores.js"

/**
 * @description controlador de login
 * @route GET /login/
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */


/**
 * @description Inicia sesión de usuario y genera un token JWT.
 * @route POST /usuarios/login
 * @param {Object} request - Objeto de solicitud de Fastify. Se espera un body con:
 *   - correo (obligatorio): Correo electrónico del usuario.
 *   - clave (obligatorio): Contraseña del usuario.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const loginUsuario = async (request, reply) =>{
    try {
        const id = Number(request.params.id)
        let usuario

        const promiseV =  new Promise((resolve, reject)=>{
            connection.query(
                'SELECT u.id ,u.nombres, u.primer_apellido  as primerApelllido, u.segundo_apellido as segundoApellido, ' +
                '  u.correo, u.id_perfil, p.nombre as nombrePerfil FROM usuario u inner join perfil p on p.id =u.id_perfil ' +
                '  WHERE u.correo = ? and u.clave= SHA2(?, 224)  limit 1 ', [request.body.correo, request.body.clave],async (error, results)=>{

                    if(error){
                        return error
                    }
                    usuario = results
                    return resolve(results)
                })
        })

        const promisesv =[promiseV]
        const resultv = await Promise.all(promisesv)

        if(!usuario){
            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + "El usuario no es valido"
            reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
        }
        const token = fastify.jwt.sign({ usuario })
        usuario[0]['token'] = token
        validTokens.set(token,usuario[0])
        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:usuario})
        //reply.status(200).send(usuario)
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
    }
}

/**
 * @description Cierra la sesión de usuario (elimina el token JWT).
 * @route DELETE /usuarios/logout  (o POST /usuarios/logout si prefieres usar POST)
 * @param {Object} request - Objeto de solicitud de Fastify. Se espera el token JWT en el header `Authorization`.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const logout = async (request, reply) =>{
    if(true){
        return true
    }
    const { authorization } = req.headers
    try {

        validTokens.forEach((v)=>{
            if(v.token === authorization){
                validTokens.delete(authorization)
            }
        })
        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:"Se ha cerrado la sesión"})

    } catch (err) {
        return false
    }
}


