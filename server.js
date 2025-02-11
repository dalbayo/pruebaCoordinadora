import Fastify from "fastify"
import {fastifyJwt} from "@fastify/jwt";
import fastifyRedis from '@fastify/redis';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { connection} from "./src/database/db.js";
import routes from "./src/routers/routers.js"

export const fastify = Fastify({
    logger:true
})


fastify.register(fastifyJwt, {
    secret: process.env.JWT_PRIVATE_KEY
})

fastify.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Prueba Coordinadora',
            description: 'API Prueba Coordinadora Documentación',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:8000'
            }
        ],
        host: 'localhost:8000',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer'
                }
            }
        },
        tags: [
            {
                name: 'Root',
                description: 'Root endpoints'
            }
        ]
    }
});


// Register @fastify/swagger-ui plugin.
fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false
    },
    uiHooks: {
        onRequest: function (_request, _reply, next) {
            next();
        },
        preHandler: function (_request, _reply, next) {
            next();
        }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
        return swaggerObject;
    },
    transformSpecificationClone: true
});


fastify.register(routes,{prefix:"/api"})
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



fastify.get('/', async function handler (request, reply) {
    const { redis } = fastify
    let result = redis.get('Test', (err, val) => {
        return err || val;
    });
    return { result }
});

const port = process.env.PORT
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

await fastify.ready()
fastify.swagger()


startServer()
