import {
    getUsusarioById,
    getUsusariosAll,
    crearUsuario,
    updateUsuario,
    deleteUsuario
} from "../controllers/UsuarioController.js"
import validateUsuarioDto from "../validations/ValidateUsuarioDto.js"
import validateLoginDTO from "../validations/ValidateLoginDto.js"
import {loginUsuario, logout} from "../controllers/LoginController.js"
import validateToken from "../validations/ValidateToken.js"
import {getRutasAll} from "../controllers/RutasController.js"
import {getCiudadesAll} from "../controllers/CiudadController.js"
import {getPerfilesAll} from "../controllers/PerfilController.js"
import {getTipoDocumentosAll} from "../controllers/TipoDocumentoController.js"
import {getTipoMercanciaAll} from "../controllers/TipoMercanciaController.js"
import {getTipoServicioAll} from "../controllers/TipoServicioController.js"
import {
    createPersona, deletePersona,
    getPersonaByDocumentoAndTipo,
    getPersonaById,
    getPersonasAll, updatePersona
} from "../controllers/PersonaController.js"
import validatePersonaDto from "../validations/ValidatePersonaDto.js"
import {getVehiculosAll} from "../controllers/VehiculoController.js"
import {
    createPlanillaViaje,
    despacharPlanillaDeViaje,
    getPlanillasViajeAll,
    getPlanillaViajeById
} from "../controllers/PlanillaViajeController.js"
import validatePlanillaViajeDto from "../validations/ValidatePlanillaViajeDto.js"
import {getRutaPrincipalById, getRutasPrincipalesAll} from "../controllers/RutasPrincipalesController.js"
import {
    asignarEncomienda, consultaInformeEncomienda, consultaInformeMetricas,
    crearEncomieda,
    entregarEncomienda,
    getEncomiendaById
} from "../controllers/EncomiendaController.js"
import validateEncomiendaDto from "../validations/ValidateEncomiendaDto.js"
import validateConsultaInformeMetricasDto from "../validations/ValidateConsultaInformeMetricasDto.js"
import validateConsultaInformeEncomiendasDto from "../validations/ValidateConsultaInformeEncomiendasDto.js"


const optsUsuarios = {
    preValidation: validateUsuarioDto
}

const optPersona = {
    preValidation: validatePersonaDto
}

const optPlanillaViaje = {
    preValidation: validatePlanillaViajeDto
}

const optEncomienda = {
    preValidation: validateEncomiendaDto
}

const optEncomiendaInforme = {
    preValidation: validateConsultaInformeEncomiendasDto
}
const optEncomiendaInformeMetricas = {
    preValidation: validateConsultaInformeMetricasDto
}
const optLogin = {
    preValidation: validateLoginDTO
}

const optToken = {
    preValidation: validateToken
}
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
    fastify.get("/encomiendas/:id",optToken, getEncomiendaById  )
    fastify.post("/encomiendas/",optEncomienda, crearEncomieda)
    fastify.get("/encomiendas_asignar/:idEncomienda/:idPlanilla",optToken, asignarEncomienda  )
    fastify.get("/planilla_viaje_despachar/:id",optToken, despacharPlanillaDeViaje )
    fastify.get("/encomienda_entregar/:id",optToken, entregarEncomienda )
    fastify.post("/consultaInforme/",optEncomiendaInforme, consultaInformeEncomienda)
    fastify.post("/consultaInformeMetricas/",optEncomiendaInformeMetricas, consultaInformeMetricas)
}

export default routers
