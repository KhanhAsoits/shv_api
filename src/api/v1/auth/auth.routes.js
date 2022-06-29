import express from "express";
import {get_token} from "./auth.controller.js";


const AuthRoutes = express.Router()

AuthRoutes.post('/get_token', get_token)

export default AuthRoutes