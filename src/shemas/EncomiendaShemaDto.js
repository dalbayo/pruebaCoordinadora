import Ajv from "ajv"
import ajvErrors from "ajv-errors"
import addFormats from "ajv-formats"
import addErrors from "ajv-errors"
import { Type } from "@sinclair/typebox"
import {ERRORES_HTTP} from "../utils/Errores.js"


export const EncomiendaShemaDto = Type.Object(
    {
        peso:Type.Number(),
        dimensiones:Type.String(
            {
                minLength:0,
                maxLength:150,
                errorMessage: {
                    type: "Debe ser un string",
                },

            }),
        telefono:Type.String(
            {
                minLength:0,
                maxLength:20,
                errorMessage: {
                    type: "Debe ser un string",
                },

            }),
        valorDeclarado:Type.Number(),
        valorEncomienda:Type.Number(),
        cantidadArticulos:Type.Number(),
        direccion:Type.String(
            {
                minLength:0,
                maxLength:200,
                errorMessage: {
                    type: "Debe ser un string",
                },

            }),
        coordenadas:Type.String(
            {
                minLength:0,
                maxLength:150,
                errorMessage: {
                    type: "Debe ser un string",
                },

            }),
        notas:Type.String(
            {
                minLength:0,
                maxLength:150,
                errorMessage: {
                    type: "Debe ser un string",
                },

            }),
        ciudadOrigen:Type.Number(),
        ciudadDestino:Type.Number(),
        remitente:Type.Number(),
        destinatario:Type.Number(),
        tipoMercancia:Type.Number(),
        tipoServicio:Type.Number()
    },{
        additionalProperties: false
    }
)
