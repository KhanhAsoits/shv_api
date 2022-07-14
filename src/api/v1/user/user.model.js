import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import {api_app} from "../../../config/app.config.js";

const {Schema} = mongoose

const UserModel = new Schema({
    name: {type: String, require: true, default: "Author No Name"},
    email: {type: String, require: true, default: " noname@gmail.com"},
    password: {type: String, require: true, default: "no password"},
    verify: {type: Boolean, require: true, default: false},
    accessToken: {type: String, require: true, default: ""},
    active: {type: Boolean, require: true, default: true},
    role: {type: Number, require: true, default: 3},
    books: [{type: Schema.Types.ObjectId, ref: 'Book'}]
}, {timestamps: true})
//register method
UserModel.statics.get_access_token = async function (token) {
    let user = await this.find({accessToken: token}).exec()
    return user.length > 0 ? user[0]?.accessToken : ''
}
UserModel.statics.find_books_by_user = async function (id) {
    return await this.findById(id).populate('books').exec()
}
UserModel.statics.find_by_id = async function (id) {
    return await this.findById(id).exec()
}
UserModel.statics.create_new_user = async function (props) {
    const [name, email, password] = [props?.name, props?.email, props?.password]
    let hash_password = jwt.sign(
        {password: password}, api_app.__secret_key
    )
    let access_token = jwt.sign(
        {name, email, password},
        api_app.__secret_key
    )
    let new_user = new this({
        name: name,
        email: email,
        password: hash_password,
        accessToken: access_token
    })
    await new_user.save()
    return new_user;
}
UserModel.statics.find_all = async function () {
    return await this.find({active: true}).exec()
}
UserModel.statics.find_all_trash = async function () {
    return await this.find({active: false}).exec()
}
UserModel.statics.find_by_email = async function (email) {
    return await this.findOne({email: email}).exec()
}
UserModel.statics.soft_remove = async function (id) {
    return await this.findOneAndUpdate({_id: id}, {active: false}, {returnDocument: 'after'}).exec()
}
UserModel.statics.update_by_id = async function (user) {

    return await this.findOneAndUpdate({_id: user.id}, {
        name: user.name,
        email: user.email,
        password: password_hash,
        role: user?.role || 3
    }, {returnDocument: 'after'}).exec()
}
export const _User = mongoose.model('User', UserModel)
