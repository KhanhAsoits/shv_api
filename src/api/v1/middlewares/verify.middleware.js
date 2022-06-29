import createError from "http-errors";
import {_User} from "../user/user.model.js";

export const verifyMiddleware = async (req, res, next) => {
    try {
        let method = req?.method
        let client_token = ''
        switch (method) {
            case 'POST':
                client_token = req.headers['authorization'] || ''
                let token_type = 'Bearer '
                if (client_token.startsWith(token_type)) {
                    client_token = client_token.slice(token_type.length, client_token.length)
                } else {
                    next(createError(400, 'We just accept bearer token!'))
                }
                break;
            case 'GET':
            case 'PUT':
                client_token = req.params?.api_token
                break;
        }
        if (client_token !== '') {
            let access_token = await _User.get_access_token(client_token)
            if (access_token !== '') {
                return next()
            } else {
                next(createError(400, 'API TOKEN NOT VALID'))
            }
        } else {
            next(createError(400, 'API TOKEN NOT VALID'))
        }
    } catch (e) {
        next(createError(500, `Internal server err : ${e}`))
    }

}