/* Dependencies */

// 1. Mongoose
const mongoose = require('mongoose')

// Data Scheme
const allScheme = new mongoose.Schema({
    // User's Credential
    credentials: {
        // User's Email
        email: { type: String, required: true, min: 6 },
        // User's password
        password: { type: String, required: true, min: 6 }
    },
    // User's Blacklist Token
    blacklist: [{
        // User's Access Token
        accessToken: { type: String, required: true },
        // User's Refresh Token
        refreshToken: { type: String, required: true },
        // User's Status Token
        status: { type: Number, required: true, default: 0 },
        // User's Date&Time Token Creation
        lastUpdate: { type: String, required: true }
    }]
    // User's Information
})

// Data Scheme Export
module.exports = mongoose.model('All', allScheme)