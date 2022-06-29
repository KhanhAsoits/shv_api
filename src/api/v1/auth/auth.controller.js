import createError from "http-errors";
import {_User} from "../user/user.model.js";
import {api_app} from "../../../config/app.config.js";
import jwt from "jsonwebtoken";
import {return_wrapper} from "../helpers/return.helper.js";

const api_links = {
    get_token: {
        path: `${api_app.__current_version}/auth/login`,
        method: 'post',
        body: {email: 'email', password: 'password'}
    }
}
export const get_token = async (req, res, next) => {
    let [email, password] = [req.body?.email, req.body?.password]

    if (!email || !password) {
        next(createError(400, 'Auth data not valid!'))
    }
    if (email && password) {
        try {
            let user = await _User.find_by_email(email)
            if (user) {
                let decode_pass = jwt.verify(user.password, api_app.__secret_key)
                if (decode_pass.password === password) {
                    res.send(return_wrapper({
                        status: true,
                        msg: 'get access token success!',
                        data: {access_token: user.accessToken},
                        links: api_links
                    }))
                } else {
                    res.send(return_wrapper({status: false, msg: 'Mật khẩu không đúng!', data: [], links: api_links}))
                }
            } else {
                return res.send(return_wrapper({
                    status: false,
                    msg: 'Email chưa được đăng ký!',
                    data: [],
                    links: api_links
                }))
            }
        } catch (e) {
            return next(createError(500, e))
        }

    }
}