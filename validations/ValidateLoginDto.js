import { Type } from "@sinclair/typebox";
import Ajv from "ajv";
import addErrors from "ajv-errors";
import addFormats from "ajv-formats";
import {ERRORES_HTTP} from "../utils/Errores.js";

const LoginDTOSchema = Type.Object(
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
);

const ajv = new Ajv({ allErrors: true });

addFormats(ajv, ["email"]);
addErrors(ajv, { keepErrors: false });
const validate = ajv.compile(LoginDTOSchema);

const validateLoginDTO = (req, res, next) => {
    const isDTOValid = validate(req.body);

    if (!isDTOValid){
        res.status(ERRORES_HTTP["400"].code).send( {error:ERRORES_HTTP["400"],response:null});
    }else{
        next();
    }
};

export default validateLoginDTO;
