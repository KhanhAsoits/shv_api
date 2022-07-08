import express from 'express'
import mongoose from "mongoose";
import {api_app} from "./src/config/app.config.js";
import {database_api} from "./src/config/database.config.js";
import {config} from "dotenv";
import createError from "http-errors";
import morgan from 'morgan'
import cors from "cors";
import helmet from "helmet";
import * as path from "path";
import UserRoutes from "./src/api/v1/user/user.routes.js";
import bodyParser from "body-parser";
import AuthRoutes from "./src/api/v1/auth/auth.routes.js";
import {_Category} from "./src/api/v1/category/category.model.js";
import {_Tag} from "./src/api/v1/tag/tag.model.js";
import {_User} from "./src/api/v1/user/user.model.js";
import {_Book} from "./src/api/v1/book/book.model.js";
import {server_request} from './server_request.js'
import bookRoutes from "./src/api/v1/book/book.routes.js";

export const server = {
    version: api_app.__current_version,
    app: express(),
    PORT: process.env.PORT || config().parsed.PORT,
    eco_system: 'development',
    init_collection: async function () {
        let categories_collection = new _Category()
        let tags_collection = new _Tag()
        let users_collection = new _User
        let books_collection = new _Book()

        await books_collection.save()
        await categories_collection.save()
        await tags_collection.save()
        await users_collection.save()
    },
    disconnect_db: async function () {
        process.on('SIGINT', async () => {
            await this.database.mongoose_db.mongoose.connection.close()
            process.exit(0)
        })

        this.database.mongoose_db.mongoose.connection.on('disconnected', () => {
            console.log('DB disconnected')
        })
    },

    connect_middleware: function () {
        this.app.use(cors())
        this.app.use(morgan('common'))
        this.app.use(helmet())
        this.app.use(bodyParser.json("50mb"))
    },

    connect_routes: async function () {
        this.app.get('/', (req, res, next) => {
            res.sendFile(path.join(path.resolve(), 'src/views/index.html'))
        })
        // config all verify route here
        this.app.use(`/${api_app.__current_version}/users`, UserRoutes)
        this.app.use(`/${api_app.__current_version}/auth`, AuthRoutes)
        this.app.use(`/${api_app.__current_version}/books`, bookRoutes)
    },
    connect_err_routes: async function () {
        this.app.use((req, res, next) => {
            next(createError(404, 'Not Found!'))
        })
        this.app.use((error, req, res, next) => {
            if (error) {
                res.send({status: false, message: error?.message})
            }
            next()
        });
    },
    database: {
        mongoose_db: {
            mongoose: mongoose,
            connect_url: database_api.mongoose.url,
            username: database_api.mongoose.user,
            password: database_api.mongoose.password,
            options: {useNewUrlParser: true, useUnifiedTopology: true}
        }
    },
    listen: async function () {
        this.database.mongoose_db.mongoose.connect(this.database.mongoose_db.connect_url, this.database.mongoose_db.options)
            .then((res) => {
                console.log('db connected')
                if (server_request.count === 0) {
                    this.init_collection()
                }
                this.app.listen(this.PORT, () => {
                    console.log('Server is running on port : ', this.PORT)
                    this.connect_middleware()
                    this.connect_routes()
                    this.connect_err_routes()
                })
            })
        this.database.mongoose_db.mongoose.connection.on('error', () => {
            console.log(createError(500, 'Database connect err'))
        })
        await this.disconnect_db()
    },
    start: async function () {
        await this.listen()
    }
}
