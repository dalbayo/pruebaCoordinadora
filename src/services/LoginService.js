import {connection} from "../database/db.js"
import {fastify, validTokens} from "../../server.js"
import {ERRORES_HTTP} from "../utils/Errores.js"

/**
 * @description servicio de login
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

export const loginUsuarioService = async (user) => {
    let usuario
    const promiseV = new Promise((resolve, reject) => {
        connection.query(
            'SELECT u.id ,u.nombres, u.primer_apellido  as primerApelllido, u.segundo_apellido as segundoApellido, ' +
            '  u.correo, u.id_perfil, p.nombre as nombrePerfil FROM usuario u inner join perfil p on p.id =u.id_perfil ' +
            '  WHERE u.correo = ? and u.clave= SHA2(?, 224)  limit 1 ', [user.correo, user.clave], async (error, results) => {

                if (error) {
                    return error
                }
                usuario = results
                return resolve(results)
            })
    })

    const resultv = await promiseV
    return usuario
}

/**
 * @description Cierra la sesión de usuario (elimina el token JWT).
 * @route DELETE /usuarios/logout  (o POST /usuarios/logout si prefieres usar POST)
 * @param {Object} request - Objeto de solicitud de Fastify. Se espera el token JWT en el header `Authorization`.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const logoutService = async (authorization) => {


    validTokens.forEach((v) => {
        if (v.token === authorization) {
            validTokens.delete(authorization)
        }
    })
    return true

}


