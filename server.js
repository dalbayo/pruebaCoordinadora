import Fastify from "fastify"
import {fastifyJwt} from "@fastify/jwt";
import fastifyRedis from '@fastify/redis';

import { connection } from "./database/db.js"

export const fastify = Fastify({
    logger:true
})


fastify.register(fastifyJwt, {
    secret: process.env.JWT_PRIVATE_KEY
})



fastify.get('/', async function handler (request, reply) {
    return { hello: 'world' }
})

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
