import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";
import { Type } from "@sinclair/typebox";
import {ERRORES_HTTP} from "../utils/Errores.js";
import validateTokenSimple from "./ValidateTokenSimple.js";


const DTO_PROPERTY_NAMES = ['peso','valorViaje','cantidadEncomiendas','notas','fechaSalida','fechaFinEstimada','rutaPrincipal','vehiculo']

const PlanillaViajeShemaDto = Type.Object(
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
const ajv = addFormats(new Ajv({ allErrors: true }), [
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
addFormats(ajv,["email"])
addErrors(ajv, { keepErrors: false });
const validador = ajv.compile(PlanillaViajeShemaDto)
 



const validatePlanillaViaje = (req, res, next) =>{

    if(validateTokenSimple(req,res)){

        const planillaViajeDto = req.body
        if(typeof planillaViajeDto !== 'object') {
            res.status(ERRORES_HTTP["400"].code).send( {error:ERRORES_HTTP["400"],response:null});
        }
        const nombresPropiedades = Object.keys(planillaViajeDto)
        /*console.log(nombresPropiedades)
        console.log("otrooo")
        console.log(DTO_PROPERTY_NAMES)*/
        const validaPropiedades = nombresPropiedades.length== DTO_PROPERTY_NAMES.length &&
            nombresPropiedades.every((nombrePropiedad) =>
                DTO_PROPERTY_NAMES.includes(nombrePropiedad)
            )
        if(!validaPropiedades){
            res.status(ERRORES_HTTP["400"].code).send( {error:ERRORES_HTTP["400"],response:null});
        }

        const isplanillaViajeDtoValido = validador(req.body)
        if (!isplanillaViajeDtoValido)
        {
            /*console.log("_______________________________________________-+" + JSON.stringify(validador.errors))
            console.log("_______________________________________________-")
*/

            let errores  = [];
            for(const val of validador.errors) {
                console.log(nombresPropiedades[0])
                errores.push({error:"La propiedad "+ val.instancePath + " "  + val.message} );
            }
            /*console.log("______________sss_________________________________-")
            console.log(errores)
            console.log(ajv.errorsText(validador.errors, { separator: "\n" }))
            console.log("_______________________________________________-")*/
            let formatoError = {
                "code": ERRORES_HTTP["400"].code,
                "message": ERRORES_HTTP["400"].message,
                "description": errores
            }
            res.status(ERRORES_HTTP["400"].code).send( {error:formatoError,response:null});
            // res.status(ERRORES_HTTP["400"].code).send({errores:errores});
            //res.status(400).send("ERROR DE VALIDACION");
        }
        next()
    }else{

        res.status(ERRORES_HTTP["401"].code).send( {error:ERRORES_HTTP["401"],response:null});
    }


}

export default validatePlanillaViaje

