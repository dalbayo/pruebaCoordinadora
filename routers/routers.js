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


const optsUsuarios = {
    preValidation: validateUsuarioDto
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
}

export default routers
/*

export const Request = FastifyRequest<{
    Querystring: {filter: string, key: string}
}>
*/


