import Fastify from "fastify"
import {fastifyJwt} from "@fastify/jwt";
import fastifyRedis from '@fastify/redis';

import { connection } from "./database/db.js"
import routes from "./routers/routers.js"
import {getRutasAll} from "./controlers/RutasControler.js";
import {ERRORES_HTTP} from "./utils/Errores.js";

export const fastify = Fastify({
    logger:true
})


fastify.register(routes,{prefix:"/api"})
fastify.register(fastifyJwt, {
    secret: process.env.JWT_PRIVATE_KEY
})
/*

// aca inicia eel error
fastify.register(fastifyRedis, {
    url: 'redis://localhost:6380',
    host: '127.0.0.1',
    password: '***',
    port: 6380, // Redis port
    family: 4   // 4 (IPv4) or 6 (IPv6)*!/!*!/
});
// aca finaliza el error
*/




/*fastify.get('/', async function handler (request, reply) {
    const { redis } = fastify
    let result = redis.get('Test', (err, val) => {
        return err || val;
    });
    return { result }
});*/

const port = process.env.port
export const validTokens = new Map();
const startServer = async () => {
    // Run the server!
  try {
    // console.log(uri)
    //connection(uri)
    await fastify.listen({ port: port })
    console.log(`Server running in http://localhost:${port}`)
      connection.query('SELECT * FROM ciudad', async (error, results)=>{
          // console.log(results)
          return results
          if(error){
              console.log(error);
          }
      });

  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
} 
 
startServer()
