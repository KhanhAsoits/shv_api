import mongoose from 'mongoose'
import {_Book} from "../book/book.model.js";
const {Schema} = mongoose


const TagModel = new Schema({
    title: {type: String, require: true, default: "Chapter"},
    books:[{type:Schema.Types.ObjectId,ref:'Book'}]
}, {timestamps: true})

export const _Tag = mongoose.model('Tag', TagModel)