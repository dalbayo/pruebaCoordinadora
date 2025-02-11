import { Type } from "@sinclair/typebox"
import Ajv from "ajv"
import addErrors from "ajv-errors"
import addFormats from "ajv-formats"
import {ERRORES_HTTP} from "../utils/Errores.js"

export const LoginDTOSchema = Type.Object(
    {
        correo: Type.String({
            format: "email",
            errorMessage: {
                type: "Debe ser un string",
                format: "Debe ser un correo electrónico válido",
            },
        }),
        clave: Type.String({
            errorMessage: {
                type: "Debe ser un string",
            },
        }),
    },
    {
        additionalProperties: false,
        errorMessage: {
            additionalProperties: "El formato del objeto no es válido",
        },
    }
)
