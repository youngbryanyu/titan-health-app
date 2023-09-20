/* Schema for user profile images and compression */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    /* MongoDB default generates a globally unique _id field */
    username: String,
    image: {
        data: ArrayBuffer,
        contentType: String
    }
})

module.exports = mnggose.model("Image", schema);