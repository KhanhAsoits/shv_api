import express from "express";
import {add, get_book_by_page} from "./book.controller.js";
import {verifyMiddleware} from "../middlewares/verify.middleware.js";


const BookRoutes = express.Router()

BookRoutes.post("/create",verifyMiddleware,add)
BookRoutes.get('/page=:page/limit=:limit/api_token=:api_token',verifyMiddleware,get_book_by_page)
export default BookRoutes