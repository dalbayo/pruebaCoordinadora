import Ajv from "ajv"
import ajvErrors from "ajv-errors"
import addFormats from "ajv-formats"
import addErrors from "ajv-errors"
import {Type} from "@sinclair/typebox"
import validateTokenSimple from "./ValidateTokenSimple.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {UsurioShemaDto} from "../shemas/UsuarioShemaDto.js"


const DTO_PROPERTY_NAMES = ['nombres', 'primerApellido', 'segundoApellido', 'correo', 'clave', 'perfil']
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
const validador = ajv.compile(UsurioShemaDto)


const validateUsuarioDto = (req, res, next) => {

    if (validateTokenSimple(req, res)) {

        const usuarioDto = req.body
        if (typeof usuarioDto !== 'object') {
            res.status(ERRORES_HTTP["400"].code).send({error: ERRORES_HTTP["400"], response: null})
        }
        const nombresPropiedades = Object.keys(usuarioDto)
        const validaPropiedades = nombresPropiedades.length == DTO_PROPERTY_NAMES.length &&
            nombresPropiedades.every((nombrePropiedad) =>
                DTO_PROPERTY_NAMES.includes(nombrePropiedad)
            )
        if (!validaPropiedades) {
            res.status(ERRORES_HTTP["400"].code).send({error: ERRORES_HTTP["400"], response: null})
        }

        const isUsuarioDtoValido = validador(req.body)

        if (!isUsuarioDtoValido) {


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

export default validateUsuarioDto

