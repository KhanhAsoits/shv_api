import mongoose from 'mongoose'
import {_Category} from "../category/category.model.js";
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
    active: {type: Boolean, require: false, default: true},
    thumbnail: {type: String, require: false, default: ''},
    suggest: {type: Boolean, require: false, default: false}
}, {timestamps: true})

BookSchema.statics.get_by_id = async function (id) {
    return this.find({_id: id, active: true}).populate('author').populate('category').populate('tags').exec();
}
BookSchema.statics.hasExit = async function (name) {
    let book = await this.findOne({title: name, active: true}).exec()
    return book !== null
}
BookSchema.statics.create = async function (book) {
    try {
        let category = await _Category.findById(book.category).exec()
        let new_book = new this({
            title: book.title,
            describe: book.describe,
            author: book.author,
            category: book.category,
            thumbnail: book.thumbnail,
            tags: book.tags
        })
        await new_book.save()
        //    save to category
        category.books.push(new_book);
        await category.save()
        //    save tag
        book.tags.forEach(async (val, index) => {
            let tag = await _Tag.findById(val).exec()
            tag.books.push(new_book)
            await tag.save()
        })
        return new_book
    } catch (e) {
        return e
    }
}
BookSchema.statics.get_suggests_by_page = async function (page, limit) {
    return await this.find({active: true, suggest: true}).sort({
        updatedAt: -1,
        active: true
    }).skip((page - 1) * limit).limit(limit).exec();

}
BookSchema.statics.get_by_page = async function (page = 1, limit) {
    return await this.find({active: true}).sort({updatedAt: -1}).skip((page - 1) * limit).limit(limit).exec();
}
BookSchema.statics.update = async function (book) {
    try {
        let old_book = await _Book.findById(book._id).exec();
        let effect = await this.findOneAndUpdate({_id: book._id}, {
            title: book.title,
            describe: book.describe,
            category: book.describe,
            tags: book.tags
        }, {returnDocument: 'after'}).exec();
        //    change category
        if (old_book.category !== book.category) {
            let oldCategory = await _Category.findById(old_book.category).exec();
            let old_book_index = oldCategory.books.indexOf(old_book);
            oldCategory.books.slice(old_book_index, 1);
            await oldCategory.save();

            let new_category = await _Category.findById(book.category).exec();
            new_category.books.push(effect)
            await new_category.save()
        }
        return true
    } catch (e) {
        console.log(e)
        return false
    }
}
BookSchema.statics.remove = async function (id) {
    try {
        return await _Book.findOneAndUpdate({_id: id}, {active: false}, {returnDocument: "after"}).exec()
    } catch (e) {
        console.log(e)
        return false
    }
}

export const _Book = mongoose.model("Book", BookSchema);

