import Ajv from "ajv"
import ajvErrors from "ajv-errors"
import addFormats from "ajv-formats"
import addErrors from "ajv-errors"
import {Type} from "@sinclair/typebox"
import {ERRORES_HTTP} from "../utils/Errores.js"

export const ConsultaEncomiendaShemaDto = Type.Object(
    {

        fechaInicio: Type.String({
            format: "date",
            errorMessage: {
                type: "Debe ser una fecha",
            }
        }),
        fechaFin: Type.String({
            format: "date",
            errorMessage: {
                type: "Debe ser una fecha",
            }
        }),
        estado: Type.Number(),
        vehiculo: Type.Number(),
        pagina: Type.Number()
    }, {
        additionalProperties: false
    }
)
