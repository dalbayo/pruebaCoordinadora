import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"


/**
 * @description Obtiene todos los usuarios con información relacionada al perfil.
 * @route GET /usuarios
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getUsusariosAllService = async () => {
    let usuarios = []
    const promise = new Promise((resolve, reject) => {
        connection.query(
            'SELECT u.id ,u.nombres, u.primer_apellido  as primerApelllido, u.segundo_apellido as segundoApellido, \n' +
            '\tu.correo, u.id_perfil, p.nombre as nombrePerfil FROM usuario u inner join perfil p on p.id =u.id_perfil ',
            async (error, results) => {
                if (error) {
                    return error
                }
                usuarios = results
                return resolve(results)
            })
    })
    const result = await promise
    return usuarios
}

/**
 * @description Obtiene un usuario por su ID, incluyendo información relacionada al perfil.
 * @route GET /usuarios/{id}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getUsusarioByIdService = async (id) => {
    let usuario
    const promise = new Promise((resolve, reject) => {
        connection.query(
            'SELECT u.id ,u.nombres, u.primer_apellido  as primerApelllido, u.segundo_apellido as segundoApellido,  ' +
            ' u.correo, u.id_perfil, p.nombre as nombrePerfil FROM usuario u inner join perfil p on p.id =u.id_perfil WHERE u.id = ?  limit 1 ', [id], async (error, results) => {
                if (error) {
                    return error
                }
                usuario = results
                return resolve(results)
            })
    })
    const result = await promise
    return usuario
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

export const crearUsuarioService = async (usuario, id) => {
    let usuarios = []
    const promise = new Promise((resolve, reject) => {
        connection.query(
            "INSERT INTO coordinadora.usuario\n" +
            "(nombres, primer_apellido, segundo_apellido, correo, clave, id_perfil) \n" +
            "VALUES(?, ?, ?, ?, SHA2(?, 224),?) ", [usuario.nombres, usuario.primerApellido, usuario.segundoApellido, usuario.correo, usuario.clave, usuario.perfil], async (error, results) => {

                if (error) {
                    return error
                }
                usuarios = results
                return resolve(results)

            })
    })

    const result = await promise
    return usuarios
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
export const updateUsuarioService = async (id, usuario) => {
    let usuarios = []
    // valida existencia del usuario
    const promise = new Promise((resolve, reject) => {
        connection.query(
            "UPDATE usuario\n" +
            "SET nombres=?, primer_apellido=?, segundo_apellido=?, correo=?,  clave= SHA2(?, 224), id_perfil=? \n" +
            "WHERE id=?", [usuario.nombres, usuario.primerApellido, usuario.segundoApellido, usuario.correo, usuario.clave, usuario.perfil, id], async (error, results) => {

                if (error) {
                    return error
                }
                usuarios = results
                return resolve(results)

            })
    })
    const result = await promise
    return usuarios
}


/**
 * @description Elimina un usuario por su ID.
 * @route DELETE /usuarios/{id}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const deleteUsuarioService = async (id) => {
    let usuarios = []
    const promise1 = new Promise((resolve, reject) => {
        connection.query(
            "DELETE FROM coordinadora.usuario WHERE id=?", [id], async (error, results) => {

                if (error) {
                    return error
                }
                usuarios = results
                return resolve(results)
            })
    })

    const promises = [promise1]
    const result = await Promise.all(promises)
    return usuarios
}
