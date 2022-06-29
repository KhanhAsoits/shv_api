import mongoose from 'mongoose'

const {Schema} = mongoose
const CategoryModel = new Schema({
    title: {type: String, require: true, default: "No title category"},
    books: [{type: Schema.Types.ObjectId, ref: 'Book'}]
}, {timestamps: true})
export const _Category = mongoose.model('Category', CategoryModel)