import Ajv from "ajv"
import ajvErrors from "ajv-errors"
import addFormats from "ajv-formats"
import addErrors from "ajv-errors"
import { Type } from "@sinclair/typebox"
import {ERRORES_HTTP} from "../utils/Errores.js"

export const PlanillaViajeShemaDto = Type.Object(
    {
        peso:Type.Number(),
        valorViaje:Type.Number(),
        cantidadEncomiendas:Type.Number(),
        notas:Type.String(
            {
                minLength:0,
                maxLength:500,
                errorMessage: {
                    type: "Debe ser un string",
                },

            }),
        fechaSalida:Type.String({
            format: "date",
            errorMessage: {
                type: "Debe ser una fecha",
            }
        }),
        fechaFinEstimada:Type.String({
            format: "date",
            errorMessage: {
                type: "Debe ser una fecha",
            }
        }),
        rutaPrincipal:Type.Number(),
        vehiculo:Type.Number()
    },{
        additionalProperties: false
    }
)
