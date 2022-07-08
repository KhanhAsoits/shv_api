import createError from "http-errors";
import {_Book} from "./book.model.js";
import {return_wrapper} from "../helpers/return.helper.js";
import {api_app} from "../../../config/app.config.js";
import {request} from "express";

const api_links = {
    get_by_id: {
        path: `/${api_app.__current_version}/books/id=id/api_token=api_token`,
    },
    get_suggests_by_page: {
        path: `${api_app.__current_version}/books/suggests/page=page/limit=limit/api_token=api_token`
    },
    get_by_page: {
        path: `${api_app.__current_version}/books/page=page/limit=limit/api_token=api_token`
    },
    create: {
        path: `${api_app.__current_version}/books/create`,
        method: "POST",
        auth: "api_token",
        body: {book: {}}
    },
    update: {
        path: `${api_app.__current_version}/books/update`,
        method: "POST",
        auth: "api_token",
        body: {book: {}}
    },
    remove: {
        path: `${api_app.__current_version}/books/remove`,
        method: "POST",
        body: {id: "id"},
        auth: "api_token"
    }
}
export const add = async (req, res, next) => {
    try {
        let book = req.body.book
        console.log(book)
        let exit = await _Book.hasExit(book.title)
        if (book) {
            if (!exit) {
                let save_book = await _Book.create(book)
                if (save_book) {
                    return res.send(return_wrapper({
                        status: true,
                        msg: "Tạo sách mới thành công!",
                        data: save_book,
                        links: api_links
                    }))
                }
            } else {
                return res.send(return_wrapper({status: false, msg: "Sách đã tồn tai!", data: [], links: api_links}))
            }
        } else {
            return res.send(return_wrapper({
                status: false,
                msg: "Dữ liệu sách không thấy!",
                data: [],
                links: api_links
            }))
        }

    } catch (e) {
        next(createError(500, e))
    }
}
export const get_book_by_page = async (req, res, next) => {
    try {
        let [page, limit] = [req.param.page, req.param.limit]
        return res.send(return_wrapper({status:true,msg:'fetch success!',data:await _Book.get_by_page(page,limit),links:api_links}))
    } catch (e) {
        return next(createError(500, e))
    }
}
export const update = async (req, rest, next) => {
    try {

    } catch (e) {
        return next(createError(500, e))
    }
}