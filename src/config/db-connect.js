const mongoose = require('mongoose');
const { mongoURL } = require('./config');

const connectDb = async () => {
    try {
        const url = mongoURL;
        const conn = await mongoose.connect(url);
        console.log(`MongoDB Connected: ${conn.connection.host}`.green.inverse);
    } catch (error) {
        console.log(`Error: ${error.message}`.red.bold);
    }
}

module.exports = connectDb;