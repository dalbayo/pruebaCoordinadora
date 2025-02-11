import {validTokens} from "../../server.js"
import {ERRORES_HTTP} from "../utils/Errores.js"


const validateTokenSimple = (req, res) => {
    if (true) {
        return true
    }
    const {authorization} = req.headers

    if (!authorization) res.status(ERRORES_HTTP["401"].code).send({error: ERRORES_HTTP["401"], response: null})

    try {
        let ingreso = false

        validTokens.forEach((v) => {
            if (v.token === authorization) {
                ingreso = true
            }
        })
        return ingreso
        if (!ingreso) {
            res.status(ERRORES_HTTP["401"].code).send({error: ERRORES_HTTP["401"], response: null})
        }
    } catch (err) {
        return false
    }
}


export default validateTokenSimple

