import { connection } from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"


/**
 * @description controlador de personas
 * @route GET /login/
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

/**
 * @description Obtiene todas las personas con información relacionada al tipo de documento.
 * @route GET /personas
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getPersonasAll = async (request, reply) =>{
    try {
        let personas  = []

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                'SELECT p.id , p.nombres, p.primer_apellido  as primerApelllido, p.segundo_apellido as segundoApellido,  '+
                        ' p.correo, p.correo , p.direccion, p.numero_documento as numeroDocumento, td.id as idTipoDocumento, td.nombre as tipoDocumentoNombre'+
                        ' FROM persona p inner join tipo_documento td on td.id = p.id_tipo_documento  ',
                async (error, results)=>{
                    if(error){
                        return error
                    }
                    personas = results
                    return resolve(results) 
                })
        })

        const promises =[promise1]
        const result = await Promise.all(promises)
        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:personas})

    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
    }
}

/**
 * @description Obtiene una persona por su ID, incluyendo información relacionada al tipo de documento.
 * @route GET /personas/{id}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const getPersonaById = async (request, reply) =>{
    try {
        const id = Number(request.params.id)
        let persona

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(

                'SELECT p.id , p.nombres, p.primer_apellido  as primerApelllido, p.segundo_apellido as segundoApellido,  '+
                ' p.correo, p.correo , p.direccion, p.numero_documento as numeroDocumento, td.id as idTipoDocumento, td.nombre as tipoDocumentoNombre'+
                ' FROM persona p inner join tipo_documento td on td.id = p.id_tipo_documento where   p.id = ?  limit 1 ', [id],async (error, results)=>{

                    if(error){
                        return error
                    }
                    persona = results
                    return resolve(results) 
                })
        })

        const promises =[promise1]
        const result = await Promise.all(promises)
        if(!persona){

            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + " No existe la persona"
            reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
        }else{
            reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:persona})
        }

    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
    }
}

/**
 * @description Obtiene una persona por su número y tipo de documento, incluyendo información relacionada.
 * @route GET /personas/documento/{numeroDocumento}/tipo/{tipoDocumento}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getPersonaByDocumentoAndTipo = async (request, reply) =>{
    try {
        const numeroDocumento = request.params.numeroDocumento
        const tipoDocumento = Number(request.params.tipoDocumento)
        let persona

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(

                'SELECT p.id , p.nombres, p.primer_apellido  as primerApelllido, p.segundo_apellido as segundoApellido,  '+
                ' p.correo, p.correo , p.direccion, p.numero_documento as numeroDocumento, td.id as idTipoDocumento, td.nombre as tipoDocumentoNombre'+
                ' FROM persona p inner join tipo_documento td on td.id = p.id_tipo_documento where   p.numero_documento = ? and p.id_tipo_documento=?  limit 1 ', [numeroDocumento,tipoDocumento],async (error, results)=>{
                    if(error){
                        return error
                    }
                    persona = results
                    return resolve(results) 
                })
        })

        const promises =[promise1]
        const result = await Promise.all(promises)
        if(!persona){

            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + " No existe la persona"
            reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
        }

        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:persona})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
    }
}


/**
 * @description Crea una nueva persona.
 * @route POST /personas
 * @param {Object} request - Objeto de solicitud de Fastify. Se espera un body con los datos de la persona:
 *   - nombres (obligatorio)
 *   - primerApellido (obligatorio)
 *   - segundoApellido (opcional)
 *   - correo (obligatorio)
 *   - telefono (obligatorio)
 *   - direccion (obligatorio)
 *   - numeroDocumento (obligatorio)
 *   - tipoDocumento (obligatorio)
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const createPersona = async (request, reply) =>{
    try {
        const {persona}  = request.body
        const id = Number(request.params.id)
        let personas  = []

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                " INSERT INTO coordinadora.persona\n" +
                " (nombres, primer_apellido, segundo_apellido, correo, telefono, direccion, numero_documento, id_tipo_documento)\n" +
                  "VALUES(?, ?, ?, ?, ?,?,?,?)\n", [request.body.nombres,request.body.primerApellido,request.body.segundoApellido,request.body.correo,request.body.telefono, request.body.direccion,
                    request.body.numeroDocumento, request.body.tipoDocumento],async (error, results)=>{

                    if(error){
                        return error
                    }
                    personas = results
                    return resolve(results) 
                })
        })

        const promises =[promise1]
        const result = await Promise.all(promises)
        if(personas){
            reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:personas[0]})
        } 
        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:"El persona se ha creado exitosamente"})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
    }
}


/**
 * @description Actualiza los datos de una persona por su ID.
 * @route PUT /personas/{id}
 * @param {Object} request - Objeto de solicitud de Fastify. Se espera un body con los datos a actualizar:
 *   - nombres (opcional)
 *   - primerApellido (opcional)
 *   - segundoApellido (opcional)
 *   - correo (opcional)
 *   - telefono (opcional)
 *   - direccion (opcional)
 *   - numeroDocumento (opcional)
 *   - tipoDocumento (opcional)
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const updatePersona = async (request, reply) =>{
    try {
        let usuarios  = []
        const id = Number(request.params.id)

        let usuario

        const promiseV =  new Promise((resolve, reject)=>{
            connection.query(
                'SELECT * FROM persona WHERE id = ?   limit 1 ', [id],async (error, results)=>{

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
            errFormat.description = errFormat.description + "La persona no existe"
            reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
        }
        //fin valida existencia del usuario

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                "UPDATE coordinadora.persona\n" +
                " SET nombres=?, primer_apellido=?, segundo_apellido=?, correo=?, telefono=?, direccion=?, numero_documento=?, id_tipo_documento=?  " +
                " WHERE id=?  " , [request.body.nombres,request.body.primerApellido,request.body.segundoApellido,request.body.correo,request.body.telefono, request.body.direccion,
                    request.body.numeroDocumento, request.body.tipoDocumento, id],async (error, results)=>{

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
            reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:"Los datos de la persona se han actualizado con exito"})
        } 
        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:"Los datos de la persona se han actualizado con exito"})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
    }
}


/**
 * @description Elimina una persona por su ID.
 * @route DELETE /personas/{id}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const deletePersona = async (request, reply) =>{
    try {
        let usuarios  = []
        const id = Number(request.params.id)

        // valida existencia del usuario
        let usuario

        const promiseV =  new Promise((resolve, reject)=>{
            connection.query(
                'SELECT * FROM persona WHERE id = ?   limit 1 ', [id],async (error, results)=>{
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
            errFormat.description = errFormat.description + "La persona no existe."
            reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
        }
        //fin valida existencia del usuario

        const promise1 =  new Promise((resolve, reject)=>{
            connection.query(
                "DELETE FROM persona WHERE id=?" , [ id],async (error, results)=>{

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
        reply.status(ERRORES_HTTP["200"].code).send( {error:null,response:"La persona ha sido borrada exitosamente"})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description +err.message
        reply.status(ERRORES_HTTP["500"].code).send( {error:errFormat,response:null})
    }
}
