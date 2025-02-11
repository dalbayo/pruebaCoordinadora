import Ajv from "ajv"
import ajvErrors from "ajv-errors"
import addFormats from "ajv-formats"
import addErrors from "ajv-errors"
import {Type} from "@sinclair/typebox"
import {ERRORES_HTTP} from "../utils/Errores.js"
import validateTokenSimple from "./ValidateTokenSimple.js"
import {PlanillaViajeShemaDto} from "../shemas/PlanillaViajeShemaDto.js"


const DTO_PROPERTY_NAMES = ['peso', 'valorViaje', 'cantidadEncomiendas', 'notas', 'fechaSalida', 'fechaFinEstimada', 'rutaPrincipal', 'vehiculo']

const ajv = addFormats(new Ajv({allErrors: true}), [
    'date-time',
    'time',
    'date',
    'email',
    'hostname',
    'ipv4',
    'ipv6',
    'uri',
    'uri-reference',
    'uuid',
    'uri-template',
    'json-pointer',
    'relative-json-pointer',
    'regex'
]).addKeyword('kind').addKeyword('modifier').addKeyword('querystring')
addFormats(ajv, ["email"])
addErrors(ajv, {keepErrors: false})
const validador = ajv.compile(PlanillaViajeShemaDto)


const validatePlanillaViaje = (req, res, next) => {

    if (validateTokenSimple(req, res)) {

        const planillaViajeDto = req.body
        if (typeof planillaViajeDto !== 'object') {
            res.status(ERRORES_HTTP["400"].code).send({error: ERRORES_HTTP["400"], response: null})
        }
        const nombresPropiedades = Object.keys(planillaViajeDto)
        const validaPropiedades = nombresPropiedades.length == DTO_PROPERTY_NAMES.length &&
            nombresPropiedades.every((nombrePropiedad) =>
                DTO_PROPERTY_NAMES.includes(nombrePropiedad)
            )
        if (!validaPropiedades) {
            res.status(ERRORES_HTTP["400"].code).send({error: ERRORES_HTTP["400"], response: null})
        }

        const isplanillaViajeDtoValido = validador(req.body)
        if (!isplanillaViajeDtoValido) {
            let errores = []
            for (const val of validador.errors) {
                errores.push({error: "La propiedad " + val.instancePath + " " + val.message})
            }
            let formatoError = {
                "code": ERRORES_HTTP["400"].code,
                "message": ERRORES_HTTP["400"].message,
                "description": errores
            }
            res.status(ERRORES_HTTP["400"].code).send({error: formatoError, response: null})
        }
        next()
    } else {

        res.status(ERRORES_HTTP["401"].code).send({error: ERRORES_HTTP["401"], response: null})
    }


}

export default validatePlanillaViaje

