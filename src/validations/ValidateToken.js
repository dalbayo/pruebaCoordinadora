import {validTokens} from "../../server.js"
import {ERRORES_HTTP} from "../utils/Errores.js"
import validateTokenSimple from "./ValidateTokenSimple.js"


const validateToken = async (req, res, next) => {
    if (validateTokenSimple(req, res)) {
        next()
    } else {
        res.status(ERRORES_HTTP["401"].code).send({error: ERRORES_HTTP["401"], response: null})
    }
}

export default validateToken

