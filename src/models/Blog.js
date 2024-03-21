const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    dateAndTime: {
        type: String,
        default: Date.now,
    }
})

const Blog = mongoose.model("blogs", blogSchema);
module.exports = Blog;