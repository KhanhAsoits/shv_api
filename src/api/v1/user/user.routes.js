import express from "express";
import {create, get_all_user, get_by_id, get_trash_user, remove, update} from "./user.controller.js";
import {verifyMiddleware} from "../middlewares/verify.middleware.js";

const UserRoutes = express.Router()

UserRoutes.post('/create', create)
UserRoutes.post('/update', verifyMiddleware, update)
UserRoutes.post('/remove', verifyMiddleware, remove)
UserRoutes.get('/api_token=:api_token', verifyMiddleware, get_all_user)
UserRoutes.get('/userId=:userId/api_token=:api_token', verifyMiddleware, get_by_id)
UserRoutes.get('/trash/api_token=:api_token', verifyMiddleware, get_trash_user)
export default UserRoutes