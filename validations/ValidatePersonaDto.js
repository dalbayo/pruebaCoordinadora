import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";
import { Type } from "@sinclair/typebox";
import {ERRORES_HTTP} from "../utils/Errores.js";
import validateTokenSimple from "./ValidateTokenSimple.js";


const DTO_PROPERTY_NAMES = ['nombres','primerApellido','segundoApellido','correo','telefono','direccion','numeroDocumento','tipoDocumento']
const PersonaShemaDto = Type.Object(
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
const validador = ajv.compile(PersonaShemaDto)
 



const validatePersonaDto = (req, res, next) =>{

    if(validateTokenSimple(req,res)){

        const personaDto = req.body
        if(typeof personaDto !== 'object') {
            res.status(ERRORES_HTTP["400"].code).send( {error:ERRORES_HTTP["400"],response:null});
        }
        const nombresPropiedades = Object.keys(personaDto)
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

        const ispersonaDtoValido = validador(req.body)
        if (!ispersonaDtoValido)
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

export default validatePersonaDto

