import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {
    createPersonaService, deletePersonaService,
    getPersonaByDocumentoAndTipoService,
    getPersonaByIdService,
    getPersonasAllService,
    updatePersonaService
} from "../services/PersonaService.js";


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
export const getPersonasAll = async (request, reply) => {
    try {
        let personas = await getPersonasAllService()
        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: personas})

    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
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

export const getPersonaById = async (request, reply) => {
    try {
        const id = Number(request.params.id)
        const persona = await getPersonaByIdService(id)
        if (!persona) {

            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + " No existe la persona"
            reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
        } else {
            reply.status(ERRORES_HTTP["200"].code).send({error: null, response: persona})
        }

    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
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
export const getPersonaByDocumentoAndTipo = async (request, reply) => {
    try {
        const numeroDocumento = request.params.numeroDocumento
        const tipoDocumento = Number(request.params.tipoDocumento)
        const persona = await getPersonaByDocumentoAndTipoService(numeroDocumento, tipoDocumento)
        if (!persona) {

            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + " No existe la persona"
            reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
        }

        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: persona})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
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
export const createPersona = async (request, reply) => {
    try {
        const {persona} = request.body
        const id = Number(request.params.id)
        let personas = await createPersonaService(persona, id)
        if (personas) {
            reply.status(ERRORES_HTTP["200"].code).send({error: null, response: personas[0]})
        }
        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: "El persona se ha creado exitosamente"})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
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

export const updatePersona = async (request, reply) => {
    try {
        const id = Number(request.params.id)
        const persona = request.body
        const personaId = await getPersonaByIdService(id)
        if (!personaId) {
            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + "La persona no existe"
            reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
        }

        let personas = await updatePersonaService(id, persona)

        if (personas) {
            reply.status(ERRORES_HTTP["200"].code).send({
                error: null,
                response: "Los datos de la persona se han actualizado con exito"
            })
        }
        reply.status(ERRORES_HTTP["200"].code).send({
            error: null,
            response: "Los datos de la persona se han actualizado con exito"
        })
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
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

export const deletePersona = async (request, reply) => {
    try {
        let usuarios = []
        const id = Number(request.params.id)
        const personaId = await getPersonaByIdService(id)
        if (!personaId) {
            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + "La persona no existe."
            reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
        }

        const persona = await deletePersonaService(id)

        if (persona) {
            reply.status(ERRORES_HTTP["200"].code).send({error: null, response: persona[0]})
        }
        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: "La persona ha sido borrada exitosamente"})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
    }
}
