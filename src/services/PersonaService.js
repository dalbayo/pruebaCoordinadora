import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {asignarEncomiendaService} from "./EncomiendaService.js";


/**
 * @description servicio de personas
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
export const getPersonasAllService = async () => {
    let personas = []

    const promise = new Promise((resolve, reject) => {
        connection.query(
            'SELECT p.id , p.nombres, p.primer_apellido  as primerApelllido, p.segundo_apellido as segundoApellido,  ' +
            ' p.correo, p.correo , p.direccion, p.numero_documento as numeroDocumento, td.id as idTipoDocumento, td.nombre as tipoDocumentoNombre' +
            ' FROM persona p inner join tipo_documento td on td.id = p.id_tipo_documento  ',
            async (error, results) => {
                if (error) {
                    return error
                }
                personas = results
                return resolve(results)
            })
    })

    const result = await promise
    return result
}

/**
 * @description Obtiene una persona por su ID, incluyendo información relacionada al tipo de documento.
 * @route GET /personas/{id}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const getPersonaByIdService = async (id) => {
    let persona

    const promise = new Promise((resolve, reject) => {
        connection.query(
            'SELECT p.id , p.nombres, p.primer_apellido  as primerApelllido, p.segundo_apellido as segundoApellido,  ' +
            ' p.correo, p.correo , p.direccion, p.numero_documento as numeroDocumento, td.id as idTipoDocumento, td.nombre as tipoDocumentoNombre' +
            ' FROM persona p inner join tipo_documento td on td.id = p.id_tipo_documento where   p.id = ?  limit 1 ', [id], async (error, results) => {

                if (error) {
                    return error
                }
                persona = results
                return resolve(results)
            })
    })

    const result = await promise
    return persona
}

/**
 * @description Obtiene una persona por su número y tipo de documento, incluyendo información relacionada.
 * @route GET /personas/documento/{numeroDocumento}/tipo/{tipoDocumento}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getPersonaByDocumentoAndTipoService = async (numeroDocumento, tipoDocumento) => {

    let persona

    const promise = new Promise((resolve, reject) => {
        connection.query(
            'SELECT p.id , p.nombres, p.primer_apellido  as primerApelllido, p.segundo_apellido as segundoApellido,  ' +
            ' p.correo, p.correo , p.direccion, p.numero_documento as numeroDocumento, td.id as idTipoDocumento, td.nombre as tipoDocumentoNombre' +
            ' FROM persona p inner join tipo_documento td on td.id = p.id_tipo_documento where   p.numero_documento = ? and p.id_tipo_documento=?  limit 1 ', [numeroDocumento, tipoDocumento], async (error, results) => {
                if (error) {
                    return error
                }
                persona = results
                return resolve(results)
            })
    })

    const result = await promise
    return persona
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
export const createPersonaService = async (persona, id) => {
    let personas = []

    const promise = new Promise((resolve, reject) => {
        connection.query(
            " INSERT INTO coordinadora.persona\n" +
            " (nombres, primer_apellido, segundo_apellido, correo, telefono, direccion, numero_documento, id_tipo_documento)\n" +
            "VALUES(?, ?, ?, ?, ?,?,?,?)\n", [persona.nombres, persona.primerApellido, persona.segundoApellido, persona.correo, persona.telefono, persona.direccion,
                persona.numeroDocumento, persona.tipoDocumento], async (error, results) => {

                if (error) {
                    return error
                }
                personas = results
                return resolve(results)
            })
    })
    const result = await promise
    return personas
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

export const updatePersonaService = async (id, persona) => {
    let usuarios = []
    let usuario

    const promise = new Promise((resolve, reject) => {
        connection.query(
            "UPDATE coordinadora.persona\n" +
            " SET nombres=?, primer_apellido=?, segundo_apellido=?, correo=?, telefono=?, direccion=?, numero_documento=?, id_tipo_documento=?  " +
            " WHERE id=?  ", [persona.nombres, persona.primerApellido, persona.segundoApellido, persona.correo, persona.telefono, persona.direccion,
                persona.numeroDocumento, persona.tipoDocumento, id], async (error, results) => {

                if (error) {
                    return error
                }
                usuarios = results
                return resolve(results)
            })
    })

    const result = await promise
    if (usuarios) {
        reply.status(ERRORES_HTTP["200"].code).send({
            error: null,
            response: "Los datos de la persona se han actualizado con exito"
        })
    }
    reply.status(ERRORES_HTTP["200"].code).send({
        error: null,
        response: "Los datos de la persona se han actualizado con exito"
    })
}


/**
 * @description Elimina una persona por su ID.
 * @route DELETE /personas/{id}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const deletePersonaService = async (id) => {
    let usuarios = []

    const promise = new Promise((resolve, reject) => {
        connection.query(
            "DELETE FROM persona WHERE id=?", [id], async (error, results) => {

                if (error) {
                    return error
                }
                usuarios = results
                return resolve(results)
            })
    })

    const result = await promise
    return "La persona ha sido borrada exitosamente"
}
