import {config} from "dotenv";
const con = config().parsed
export const system = {
    product: {port: process.env.PORT},
    development: {port: con.PORT}
}