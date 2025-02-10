import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";
import { Type } from "@sinclair/typebox";
import {ERRORES_HTTP} from "../utils/Errores.js";
import validateTokenSimple from "./ValidateTokenSimple.js";



const DTO_PROPERTY_NAMES = ['pagina', 'fechaInicio','fechaFin','estado','vehiculo']

const ConsultaEncomiendaShemaDto = Type.Object(
    {

        fechaInicio:Type.String({
            format: "date",
            errorMessage: {
                type: "Debe ser una fecha",
            }
        }),
        fechaFin:Type.String({
            format: "date",
            errorMessage: {
                type: "Debe ser una fecha",
            }
        })
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
const validador = ajv.compile(ConsultaEncomiendaShemaDto)
 



const validateConsultaInformeMetricasDto = (req, res, next) =>{

    if(validateTokenSimple(req,res)){

        const consultaEncomiendaDto = req.body
        if(typeof consultaEncomiendaDto !== 'object') {
            res.status(ERRORES_HTTP["400"].code).send( {error:ERRORES_HTTP["400"],response:null});
        }
        const nombresPropiedades = Object.keys(consultaEncomiendaDto)
        /*console.log(nombresPropiedades)
        console.log("otrooo")
        console.log(DTO_PROPERTY_NAMES)*/
        const validaPropiedades = nombresPropiedades.length== DTO_PROPERTY_NAMES.length &&
            nombresPropiedades.every((nombrePropiedad) =>
                DTO_PROPERTY_NAMES.includes(nombrePropiedad)
            )
        if(!validaPropiedades){
            //res.status(ERRORES_HTTP["400"].code).send( {error:ERRORES_HTTP["400"],response:null});
        }

        const isconsultaEncomiendaDtoValido = validador(req.body)
        if (!isconsultaEncomiendaDtoValido)
        {
            /*console.log("_______________________________________________-+" + JSON.stringify(validador.errors))
            console.log("_______________________________________________-")
*/

            let errores  = [];
            for(const val of validador.errors) {
                console.log(nombresPropiedades[0])
                if(!val.message.includes("required")){
                    errores.push({error:"La propiedad "+ val.instancePath + " "  + val.message} );
                }
            }
            if(errores.length==0){
                next()
            }else{

                let formatoError = {
                    "code": ERRORES_HTTP["400"].code,
                    "message": ERRORES_HTTP["400"].message,
                    "description": errores
                }
                res.status(ERRORES_HTTP["400"].code).send( {error:formatoError,response:null});
            }
            // res.status(ERRORES_HTTP["400"].code).send({errores:errores});
            //res.status(400).send("ERROR DE VALIDACION");
        }
        next()
    }else{

        res.status(ERRORES_HTTP["401"].code).send( {error:ERRORES_HTTP["401"],response:null});
    }


}

export default validateConsultaInformeMetricasDto

