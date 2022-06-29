import mongoose from 'mongoose'
import {_Category} from "../category/category.model.js";
import {_User} from "../user/user.model.js";
import {_Tag} from "../tag/tag.model.js";

const {Schema} = mongoose

const BookSchema = new Schema({
    title: {type: String, require: true, default: "No Title Book"},
    chapter: {type: Number, require: true, default: 0},
    describe: {type: String, require: false, default: ""},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    rate: {type: Number, require: true, default: 0},
    tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
    active: {type: Boolean, require: false, default: true}
}, {timestamps: true})

export const _Book = mongoose.model("Book", BookSchema);

