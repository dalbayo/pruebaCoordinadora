import { Type } from "@sinclair/typebox"
import Ajv from "ajv"
import addErrors from "ajv-errors"
import addFormats from "ajv-formats"
import {ERRORES_HTTP} from "../utils/Errores.js"
import {LoginDTOSchema} from "../shemas/LoginShemaDto.js"


const ajv = new Ajv({ allErrors: true })

addFormats(ajv, ["email"])
addErrors(ajv, { keepErrors: false })
const validate = ajv.compile(LoginDTOSchema)

const validateLoginDTO = (req, res, next) => {
    const isDTOValid = validate(req.body)

    if (!isDTOValid){
        res.status(ERRORES_HTTP["400"].code).send( {error:ERRORES_HTTP["400"],response:null})
    }else{
        next()
    }
}

export default validateLoginDTO
