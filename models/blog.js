const mongoose = require("mongoose")
const bcrypt = require("bcrypt-nodejs")
mongoose.Promise = global.Promise
const Schema = mongoose.Schema
const UserSchema = new Schema({
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    password: { type: String, unique: true }
})

const blogSchema = mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    createdBy: { type: String },
    createAt: { type: Date, default: Date.now() },
    likes: { type: Number, default: 0 },
    likedBy: { type: Array },
    dislikes: { type: Number, default: 0 },
    dislikedBy: { type: Array },
    coments: [{
        comment: { type: String },
        commentator: { type: String }
    }]
})

module.exports = mongoose.model('Blog', blogSchema)