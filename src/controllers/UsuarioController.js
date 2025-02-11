import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {
    crearUsuarioService, deleteUsuarioService,
    getUsusarioByIdService,
    getUsusariosAllService,
    updateUsuarioService
} from "../services/UsuarioService.js";


/**
 * @description Obtiene todos los usuarios con información relacionada al perfil.
 * @route GET /usuarios
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getUsusariosAll = async (request, reply) => {
    try {
        let usuarios = await getUsusariosAllService()
        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: usuarios})

    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
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
export const getUsusarioById = async (request, reply) => {
    try {
        const id = Number(request.params.id)
        let usuario = await getUsusarioByIdService(id)
        if (!usuario) {

            let errFormat = ERRORES_HTTP["500"]
            errFormat.description = errFormat.description + " No existe el usuario"
            reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
        }

        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: usuario})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
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

export const crearUsuario = async (request, reply) => {
    try {
        const usuario = request.body
        const id = Number(request.params.id)
        let usuarios = await crearUsuarioService(usuario, id)
        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: "El usuario se ha creado exitosamente"})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
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
export const updateUsuario = async (request, reply) => {
    try {
        const id = Number(request.params.id)
        const usuario = request.body

        let usuarios = await updateUsuarioService(id, usuario)
        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: "El usuario se ha actualizado con exito"})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
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

export const deleteUsuario = async (request, reply) => {
    try {
        const id = Number(request.params.id)
        // valida existencia del usuario
        const usuarios = await deleteUsuarioService(id)
        reply.status(ERRORES_HTTP["200"].code).send({error: null, response: "El usuario ha sido borrado con exito"})
    } catch (err) {
        let errFormat = ERRORES_HTTP["500"]
        errFormat.description = errFormat.description + err.message
        reply.status(ERRORES_HTTP["500"].code).send({error: errFormat, response: null})
    }
}
