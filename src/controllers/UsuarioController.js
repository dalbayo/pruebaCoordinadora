import { connection } from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"


/**
 * @description Obtiene todos los usuarios con información relacionada al perfil.
 * @route GET /usuarios
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getUsusariosAll = async (request, reply) =>{
    try {
        let usuarios  = []

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                'SELECT u.id ,u.nombres, u.primer_apellido  as primerApelllido, u.segundo_apellido as segundoApellido, \n' +
                '\tu.correo, u.id_perfil, p.nombre as nombrePerfil FROM usuario u inner join perfil p on p.id =u.id_perfil ',
                async (error, results)=>{
                    if(error){
                        return error
                    }
                    usuarios = results
                    return resolve(results)

                    // reply.status(200).send(usuarios)
                })
        })

        const promises =[promise1]
        const result = await Promise.all(promises)
        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:usuarios})

    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
    }
}

/**
 * @description Obtiene un usuario por su ID, incluyendo información relacionada al perfil.
 * @route GET /usuarios/{id}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getUsusarioById = async (request, reply) =>{
    try {
        const id = Number(request.params.id)
        let usuario

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                'SELECT u.id ,u.nombres, u.primer_apellido  as primerApelllido, u.segundo_apellido as segundoApellido,  ' +
                ' u.correo, u.id_perfil, p.nombre as nombrePerfil FROM usuario u inner join perfil p on p.id =u.id_perfil WHERE u.id = ?  limit 1 ', [id],async (error, results)=>{
                    if(error){
                        return error
                    }
                    usuario = results
                    return resolve(results)

                    // reply.status(200).send(usuarios)
                })
        })

        const promises =[promise1]
        const result = await Promise.all(promises)
        if(!usuario){

            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + " No existe el usuario"
            reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
        }

        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:usuario})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
    }
}


/**
 * @description Crea un nuevo usuario.
 * @route POST /usuarios
 * @param {Object} request - Objeto de solicitud de Fastify. Se espera un body con los datos del usuario:
 *   - nombres (obligatorio)
 *   - primerApellido (obligatorio)
 *   - segundoApellido (opcional)
 *   - correo (obligatorio)
 *   - clave (obligatorio)
 *   - perfil (obligatorio)
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const crearUsuario = async (request, reply) =>{
    try {
        const {usuario}  = request.body
        const id = Number(request.params.id)
        let usuarios  = []
        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                "INSERT INTO coordinadora.usuario\n" +
                "(nombres, primer_apellido, segundo_apellido, correo, clave, id_perfil) \n" +
                "VALUES(?, ?, ?, ?, ?,?)\n", [request.body.nombres,request.body.primerApellido,request.body.segundoApellido,request.body.correo,clave, request.body.perfil],async (error, results)=>{

                    if(error){
                        return error
                    }
                    usuarios = results
                    return resolve(results)

                })
        })

        const promises =[promise1]
        const result = await Promise.all(promises)
        if(usuarios){
            reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:usuarios[0]})
        }
        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:"El usuario se ha creado exitosamente"})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
    }
}


/**
 * @description Actualiza los datos de un usuario por su ID.
 * @route PUT /usuarios/{id}
 * @param {Object} request - Objeto de solicitud de Fastify. Se espera un body con los datos a actualizar:
 *   - nombres (opcional)
 *   - primerApellido (opcional)
 *   - segundoApellido (opcional)
 *   - correo (opcional)
 *   - clave (opcional)
 *   - perfil (opcional)
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const updateUsuario = async (request, reply) =>{
    try {
        let usuarios  = []
        const id = Number(request.params.id)

        // valida existencia del usuario
        let usuario

        const promiseV =  new Promise((resolve, reject)=>{
            connection.query(
                'SELECT * FROM usuario WHERE id = ? and clave= SHA2(?, 224)  limit 1 ', [id, request.body.clave],async (error, results)=>{
                    // console.error(" inicia resul")
                    // console.log(results)
                    if(error){
                        return error
                    }
                    usuario = results
                    return resolve(results)

                    // reply.status(200).send(usuarios)
                })
        })

        const promisesv =[promiseV]
        const resultv = await Promise.all(promisesv)
        if(!usuario){
            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + " El usuario no es valido"
            reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
        }
        //fin valida existencia del usuario

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                "UPDATE usuario\n" +
                "SET nombres=?, primer_apellido=?, segundo_apellido=?, correo=?,  clave= SHA2(?, 224), id_perfil=? \n" +
                "WHERE id=?" , [request.body.nombres,request.body.primerApellido,request.body.segundoApellido,request.body.correo,request.body.clave, request.body.perfil, id],async (error, results)=>{

                    if(error){
                        return error
                    }
                    usuarios = results
                    return resolve(results)

                })
        })

        const promises =[promise1]
        const result = await Promise.all(promises)

        if(usuarios){
            reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:usuarios[0]})
        }
        //reply.status(500).send({error:'error interno'})
        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:"El usuario se ha actualizado con exito"})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
    }
}


/**
 * @description Elimina un usuario por su ID.
 * @route DELETE /usuarios/{id}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const deleteUsuario = async (request, reply) =>{
    try {
        let usuarios  = []
        const id = Number(request.params.id)
        // valida existencia del usuario
        let usuario

        const promiseV =  new Promise((resolve, reject)=>{
            connection.query(
                'SELECT * FROM usuario WHERE id = ?  limit 1 ', [id],async (error, results)=>{
                    // console.error(" inicia resul")
                    // console.log(results)
                    if(error){
                        return error
                    }
                    usuario = results
                    return resolve(results)

                    // reply.status(200).send(usuarios)
                })
        })

        const promisesv =[promiseV]
        const resultv = await Promise.all(promisesv)
        if(!usuario){
            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + " El usuario no es valido."
            reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
        }
        //fin valida existencia del usuario

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                "DELETE FROM coordinadora.usuario WHERE id=?" , [ id],async (error, results)=>{

                    if(error){
                        return error
                    }
                    usuarios = results
                    return resolve(results)

                    // reply.status(200).send(usuarios)
                })
        })

        const promises =[promise1]
        const result = await Promise.all(promises)
        if(usuarios){
            reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:usuarios[0]})
        }
        //reply.status(500).send({error:'error interno'})
        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:"El usuario ha sido borrado con exito"})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
    }
}
