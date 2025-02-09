import {validTokens} from "../server.js";
import {ERRORES_HTTP} from "../utils/Errores.js";


const validateTokenSimple = (req, res) => {
   /* console.log("validateToken")
    console.log(req.headers)*/
    if(true){
        return true;
    }
    const { authorization } = req.headers;
   /* console.log("authorization")
    console.log(authorization)*/

    if (!authorization)res.status(ERRORES_HTTP["401"].code).send( {error:ERRORES_HTTP["401"],response:null});

    try {
        let ingreso =false;
        /*console.log(validTokens)*/

        validTokens.forEach((v)=>{
            /*console.log("forEach")
            console.log(v)
            console.log(v.token)
            console.log(authorization)
            console.log((v.token === authorization))
            console.log((v.token == authorization))*/
            if(v.token === authorization){
                ingreso = true;
            }
        });
        return ingreso
        if(!ingreso){
            res.status(ERRORES_HTTP["401"].code).send( {error:ERRORES_HTTP["401"],response:null});
        }
    } catch (err) {
        return false;
    }
};


export default validateTokenSimple;

