import Ajv from "ajv"
import ajvErrors from "ajv-errors"
import addFormats from "ajv-formats"

import addErrors from "ajv-errors"
import {Type} from "@sinclair/typebox"
import {ERRORES_HTTP} from "../utils/Errores.js"


export const UsurioShemaDto = Type.Object(
    {
        nombres: Type.String(
            {
                minLength: 3,
                maxLength: 100,
                errorMessage: {
                    type: "Debe ser un string",
                },

            }),
        primerApellido: Type.String(
            {
                minLength: 3,
                maxLength: 100,
                errorMessage: {
                    type: "Debe ser un string",
                },
            }),
        segundoApellido: Type.String(
            {
                minLength: 3,
                maxLength: 100,
                errorMessage: {
                    type: "Debe ser un string",
                },
            }),
        correo: Type.String({
            format: "email",
            errorMessage: {
                type: "Debe ser un string",
                format: "Debe ser un correo electrónico válido",
            },
        }),
        clave: Type.String(
            {
                minLength: 8,
                maxLength: 25,
                errorMessage: {
                    type: "Debe ser un string",
                },
            }),
        perfil: Type.Number()
    }, {
        additionalProperties: false
    }
)
