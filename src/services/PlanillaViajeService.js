import {connection} from "../database/db.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {getVehiculoByIdActivo} from "./VehiculoController.js"
import {ESTADOS_PLANILLA} from "../utils/EstadoPlanillaViaje.js"
import {ESTADOS_VEHICULO} from "../utils/EstadoVehiculos.js"

/**
 * @description Obtiene todas las planillas de viaje con información relacionada, con paginación.
 * @route GET /planillas/page/{pagina}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */

export const getPlanillasViajeAllService = async (pagina) => {

    let paginado = 50
    const paginaInicia = paginado * pagina
    let planillasViajes = []

    const promise = new Promise((resolve, reject) => {
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
            "on d2.id = c2.id_departamento limit  " + paginaInicia + "," + paginado + " ",
            async (error, results) => {
                if (error) {
                    return error
                }
                planillasViajes = results
                return resolve(results)


            })
    })

    const result = await promise
    return planillasViajes
}

/**
 * @description Obtiene una planilla de viaje por su ID.
 * @route GET /planillas/{id}
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const getPlanillaViajeByIdService = async (id) => {
    let planillaViaje

    const promise = new Promise((resolve, reject) => {
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
            "on d2.id = c2.id_departamento where pv.id=?   limit 1 ", [id], async (error, results) => {

                if (error) {
                    return error
                }
                planillaViaje = results
                return resolve(results)


            })
    })
    const result = await promise
    return planillaViaje
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
export const createPlanillaViajeService = async (planillaViaje) => {
    let respuesta
    const promise = new Promise((resolve, reject) => {
        try {

            connection.query(
                " CALL coordinadora.createPlanillaViaje(?,?,?,?, " +
                "?,?," +
                "?,?," +
                "?,?, @resultado)   ",
                [planillaViaje.peso, planillaViaje.valorViaje, planillaViaje.cantidadEncomiendas, planillaViaje.notas
                    , ESTADOS_PLANILLA.CREADO.code, ESTADOS_VEHICULO.ACTIVO.code,
                    planillaViaje.fechaSalida, planillaViaje.fechaFinEstimada,
                    planillaViaje.rutaPrincipal, planillaViaje.vehiculo], async (error, results, fields) => {

                    if (error) {
                        return error
                    }
                    respuesta = results
                    return resolve(results)


                })
        } catch (errerr) {

        }
    })

    const result = await promise
    return respuesta
}


/**
 * @description Marca una planilla de viaje como despachada (en ruta).
 * @route PUT /planillas/{id}/despacho
 * @param {Object} request - Objeto de solicitud de Fastify.
 * @param {Object} reply - Objeto de respuesta de Fastify.
 * @returns {Promise<void>}
 * @author Daniel Barrera
 */
export const despacharPlanillaDeViajeService = async (id) => {
    let respuesta
    const promise = new Promise((resolve, reject) => {
        try {

            connection.query(
                " CALL coordinadora.despacharViaje(? , @resultado)   ",
                [id], async (error, results, fields) => {

                    if (error) {
                        return error
                    }
                    respuesta = results
                    return resolve(results)
                })
        } catch (errerr) {
        }
    })

    const result = await promise
    return respuesta
}

