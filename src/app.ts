import { errorMiddleware, getAuthenticator } from '@panenco/papi';
import express, { Application, NextFunction, Request, Response } from 'express';
import { getMetadataArgsStorage, RoutingControllersOptions, useExpressServer } from 'routing-controllers';
import { UserController } from './controllers/users/user.controller';
import 'express-async-errors';
import { AuthController } from './controllers/auth/auth.controller';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express'
import { MikroORM, RequestContext } from '@mikro-orm/core';
import ormConfig from './orm.config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { RecipeController } from './controllers/recipes/recipe.controller';
import { FridgeController } from './controllers/fridges/fridge.controller';
import { ProductController } from './controllers/products/product.controller';
import { ContentController } from './controllers/contents/content.controller';

export class App {
    public orm: MikroORM<PostgreSqlDriver>;
    host: Application;
    constructor() {
        //init server
        this.host = express();
        this.host.use(express.json())
        this.host.use((req,res,next) => {
            console.log(req.method, req.url);
            next();
        })
        this.host.use((req, __, next: NextFunction) => {
            RequestContext.create(this.orm.em, next);
          });
        this.initializeControllers([UserController, AuthController, RecipeController, FridgeController, ProductController, ContentController]);
        this.initializeSwagger();
        this.host.use(errorMiddleware);

       
    }

    listen() {
        this.host.listen(3000, () => {
            console.info('http://localhost:3000');
            console.info('=====================')
        })
    }

    private initializeControllers(controllers: Function[]) {
        useExpressServer(this.host, { // Link the express host to routing-controllers
        cors: {
           origin: "*", // Allow all origins, any application on any url can call our api. This is why we also added the `cors` package.
           exposedHeaders: ["x-auth"], // Allow the header `x-auth` to be exposed to the client. This is needed for the authentication to work later.
        },
        controllers, // Provide the controllers. Currently this won't work yet, first we need to convert the Route to a routing-controllers controller.
        defaultErrorHandler: false, // Disable the default error handler. We will handle errors through papi later.
        routePrefix: "/api", // Map all routes to the `/api` path.
        authorizationChecker: getAuthenticator('secretSecretStuff') //same secret as used when creating token
        });
     }


    private initializeSwagger() {
        const { defaultMetadataStorage } = require('class-transformer/cjs/storage');

        const schemas = validationMetadatasToSchemas({
        classTransformerMetadataStorage: defaultMetadataStorage,
        refPointerPrefix: '#/components/schemas/',
        }); // convert the metadata to an OpenAPI json schema

        const routingControllersOptions: RoutingControllersOptions = {
        routePrefix: '/api', // Set the route prefix so swagger knows all endpoints are prefixed with /api
        }; // configure some general options

        const storage = getMetadataArgsStorage();
        const spec = routingControllersToSpec(storage, routingControllersOptions, { // Convert the routing controller metadata + the class-validator metadata into an OpenAPI spec
        components: {
            schemas,
            securitySchemes: { // Add a security scheme so we will be able to enter a token on the endpoints
            JWT: {
                in: 'header',
                name: 'x-auth', // Define the header key to use
                type: 'apiKey',
                bearerFormat: 'JWT',
                description: 'JWT Authorization header using the JWT scheme. Example: "x-auth: {token}"',
            },
            },
        },
        security: [{ JWT: [] }],
        });

        this.host.use('/docs', swaggerUi.serve, swaggerUi.setup(spec)); // Host swagger ui on /docs
    }
    public async createConnection() {
        try {
          this.orm = await MikroORM.init(ormConfig);
        } catch (error) {
          console.log('Error while connecting to the database', error);
        }
    }
}