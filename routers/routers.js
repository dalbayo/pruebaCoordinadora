import {
    getUsusarioById,
    getUsusariosAll,
    crearUsuario,
    updateUsuario,
    deleteUsuario
} from "../controlers/UsuarioControler.js";
import validateUsuarioDto from "../validations/ValidateUsuarioDto.js";
import validateLoginDTO from "../validations/ValidateLoginDto.js";
import {loginUsuario, logout} from "../controlers/LoginControler.js";
import validateToken from "../validations/ValidateToken.js";
import {getRutasAll} from "../controlers/RutasControler.js";
import {fastify} from "../server.js";
import {ERRORES_HTTP} from "../utils/Errores.js";
import {getCiudadesAll} from "../controlers/CiudadControler.js";
import {getPerfilesAll} from "../controlers/PerfilControler.js";
import {getTipoDocumentosAll} from "../controlers/TipoDocumentoControler.js";
import {getTipoMercanciaAll} from "../controlers/TipoMercanciaControler.js";
import {getTipoServicioAll} from "../controlers/TipoServicioControler.js";
import {
    createPersona, deletePersona,
    getPersonaByDocumentoAndTipo,
    getPersonaById,
    getPersonasAll, updatePersona
} from "../controlers/PersonaControler.js";
import validatePersonaDto from "../validations/ValidatePersonaDto.js";
import {getVehiculosAll} from "../controlers/VehiculoControler.js";
import {createPlanillaViaje, getPlanillasViajeAll, getPlanillaViajeById} from "../controlers/PlanillaViajeControler.js";
import validatePlanillaViajeDto from "../validations/ValidatePlanillaViajeDto.js";
import {getRutaPrincipalById, getRutasPrincipalesAll} from "../controlers/RutasPrincipalesControler.js";


const optsUsuarios = {
    preValidation: validateUsuarioDto
}

const optPersona = {
    preValidation: validatePersonaDto
}

const optPlanillaViaje = {
    preValidation: validatePlanillaViajeDto
}
const optLogin = {
    preValidation: validateLoginDTO
}

const optToken = {
    preValidation: validateToken
}
/*
const optTokenRedis = {
    preValidation: validateToken,
    preHandler:  async (req, reply, next) => {
        const { redis } = fastify
        redis.get("getAllRutas", (err, val) => {
            /!*reply.send(err || val)*!/

            reply.status(ERRORES_HTTP["200"].code).send( val);
        })
        next()
    }
}*/

const routers = async (fastify, options)=>{
    fastify.get("/usuarios/",optToken, getUsusariosAll)
    fastify.get("/usuarios/:id",optToken, getUsusarioById)
    fastify.post("/usuarios/",optsUsuarios, crearUsuario)
    fastify.put("/usuarios/:id",optsUsuarios, updateUsuario)
    fastify.delete("/usuarios/:id",optToken, deleteUsuario)
    fastify.post("/login/",optLogin, loginUsuario)
    fastify.post("/logout/",optToken, logout)
    fastify.get("/personas/",optToken, getPersonasAll )
    fastify.get("/personas/:id",optToken, getPersonaById )
    fastify.get("/personas/:tipoDocumento/:numeroDocumento",optToken, getPersonaByDocumentoAndTipo )
    fastify.post("/personas/",optPersona, createPersona )
    fastify.put("/personas/:id",optPersona, updatePersona)
    fastify.delete("/personas/:id",optToken, deletePersona)
    fastify.get("/ciudades/:pagina",optToken, getCiudadesAll)
    fastify.get("/perfiles/",optToken, getPerfilesAll)
    fastify.get("/tipoDocumentos/",optToken, getTipoDocumentosAll)
    fastify.get("/tipoMercancias/",optToken, getTipoMercanciaAll)
    fastify.get("/tipoServicios/",optToken, getTipoServicioAll)
    fastify.get("/vehiculos/",optToken, getVehiculosAll)
    fastify.get("/rutas/:pagina",optToken, getRutasAll)
    fastify.get("/rutas_principales/:pagina",optToken, getRutasPrincipalesAll)
    fastify.get("/rutas_principales_completa/:id",optToken, getRutaPrincipalById)
    fastify.get("/planilla_viaje/:pagina",optToken, getPlanillasViajeAll )
    fastify.get("/planilla_viaje_detalle/:id",optToken, getPlanillaViajeById )
    fastify.post("/planilla_viaje/",optPlanillaViaje, createPlanillaViaje)
}

export default routers
/*

export const Request = FastifyRequest<{
    Querystring: {filter: string, key: string}
}>
*/


