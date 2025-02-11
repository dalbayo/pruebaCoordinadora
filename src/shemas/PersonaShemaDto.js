import Ajv from "ajv"
import ajvErrors from "ajv-errors"
import addFormats from "ajv-formats"
import addErrors from "ajv-errors"
import { Type } from "@sinclair/typebox"
import {ERRORES_HTTP} from "../utils/Errores.js"


export const PersonaShemaDto = Type.Object(
    {
        nombres:Type.String(
            {
                minLength:3,
                maxLength:100,
                errorMessage: {
                    type: "Debe ser un string",
                },

            }),
        primerApellido:Type.String(
            {
                minLength:3,
                maxLength:100,
                errorMessage: {
                    type: "Debe ser un string",
                },
            }),
        segundoApellido:Type.String(
            {
                minLength:3,
                maxLength:100,
                errorMessage: {
                    type: "Debe ser un string",
                },
            }),
        correo:Type.String({
            format: "email",
            errorMessage: {
                type: "Debe ser un string",
                format: "Debe ser un correo electrónico válido",
            },
        }),
        telefono:Type.String(
            {
                minLength:6,
                maxLength:25,
                errorMessage: {
                    type: "Debe ser un string",
                },
            }),
        direccion:Type.String(
            {
                minLength:6,
                maxLength:200,
                errorMessage: {
                    type: "Debe ser un string",
                },
            }),
        numeroDocumento:Type.String(
            {
                minLength:4,
                maxLength:20,
                errorMessage: {
                    type: "Debe ser un string",
                },
            }),
        tipoDocumento:Type.Number()
    },{
        additionalProperties: false
    }
)
