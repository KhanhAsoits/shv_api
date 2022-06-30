import {_User} from "./user.model.js";
import createError from "http-errors";
import {return_wrapper} from "../helpers/return.helper.js";
import jwt from "jsonwebtoken";
import {api_app} from "../../../config/app.config.js";

const api_links = {
    book_by_user: `${api_app.__current_version}/users/userId/books/`,
    get_user_by_id: `${api_app.__current_version}/users/userId=userId`,
    get_all_user: `${api_app.__current_version}/users/`,
    get_all_trash_user: `${api_app.__current_version}/users/trash/api_token=api_token`,
    create_user: {
        path: `${api_app.__current_version}/users/create`, method: 'post', body: {
            name: 'name', email: 'email', password: 'password'
        }
    },
    update_user: {
        path: `${api_app.__current_version}/users/update`,
        method: 'post',
        body: {userId: 'require', name: 'name', email: 'email', password: 'password', role: 'default 3 or custom'}
    },
    remove_user: {
        path: `${api_app.__current_version}/users/remove`, method: 'post', body: {userId: 'userId'}
    },
}
export const get_by_id = async (req, res, next) => {
    try {
        let id = req.params.userId
        if (id) {
            let user = await _User.find_by_id(id)
            if (user) {
                let return_user = {...user._doc, accessToken: ""}
                return res.send(return_wrapper({status: true, msg: 'get success', data: return_user, links: api_links}))
            } else {
                return res.send(return_wrapper({status: false, msg: 'No user found', data: [], links: api_links}))
            }
        } else {
            return next(createError(400, 'userId not found in client sent!'))
        }
    } catch (e) {
        return next(createError(500, e))
    }
}
export const get_all_user = async (req, res, next) => {
    try {
        let users = await _User.find_all()
        if (users?.length > 0) {
            return res.send(return_wrapper({status: true, msg: 'get success', data: users, links: api_links}))
        } else {
            return res.send(return_wrapper({status: false, msg: 'No users', data: [], links: api_links}))
        }
    } catch (e) {
        return (createError(500, e))
    }
}
export const remove = async (req, res, next) => {
    try {
        let id = req.body.userId

        if (id) {
            let remove_user = await _User.soft_remove(id)
            if (remove_user) {
                return res.send(return_wrapper({
                    status: true, msg: 'remove success', data: remove_user, links: api_links
                }))
            } else {
                return res.send(return_wrapper({
                    status: false, msg: 'remove failed', data: [], links: api_links
                }))
            }
        } else {
            return next(createError(400, 'userId not found to client sent!'))
        }
    } catch (e) {
        return next(createError(500, e))
    }
}
export const update = async (req, res, next) => {

    try {
        let update_data = req.body.user
        if (update_data?.userId) {
            let password_hash = jwt.sign(
                {password: update_data.password}, api_app.__secret_key
            )
            update_data.password = password_hash
            let user = await _User.update(update_data)
            if (user) {
                return res.send(return_wrapper({status: true, msg: 'update success', data: user, links: api_links}))
            } else {
                return res.send(return_wrapper({
                    status: false,
                    msg: 'update failed',
                    data: update_data,
                    links: api_links
                }))
            }
        } else {
            return next(createError(400, 'userId can\'t not null in sent data!'))
        }
    } catch (e) {
        return next(createError(500, e))
    }
}
export const create = async (req, res, next) => {
    try {
        const [name, email, password] = [req.body?.name, req.body?.email, req.body?.password]
        if (!name || !email || !password) {
            return next(createError(400, 'DATA NOT VALID'))
        }
        let hasExit = await _User.find_by_email(email)

        if (!hasExit) {
            let new_user = await _User?.create_new_user({name, email, password})
            let return_user = {...new_user?._doc, accessToken: ''}
            res.send(return_wrapper({status: true, msg: 'Đăng ký thành công!', data: return_user, links: api_links}))
        } else {
            res.send(return_wrapper({status: false , msg: 'Email đã được đăng ký!', data: [],links: api_links}))
        }
    } catch (e) {
        return next(createError(400, return_wrapper({
            status: false, msg: 'something err in user controller', data: {}
        })))
    }

}
export const get_trash_user = async (req, res, next) => {
    try {
        let users = await _User.find_all_trash()
        if (users.length > 0) {
            return res.send(return_wrapper({status: true, msg: 'get success', data: users, links: api_links}))
        } else {
            return res.send(return_wrapper({status: false, msg: 'No users', data: [], links: api_links}))
        }
    } catch (e) {
        return (createError(500, e))
    }
}
