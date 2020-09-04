/* Dependencies */

// 1. Express & Routes
const router = require('express').Router()
// 2. Mongoose
const mongoose = require('mongoose')
// 3. Model
const All = require('../models/All')
// 4. JWT
const jwt = require('jsonwebtoken')
// 5. Verification
const { verifyUser } = require('../controllers/verification')

/* Routes */

// HOME get Router
router.get('/', verifyUser, async(req, res) => {
    // get User's info data
    const userInfo = await All.findOne({ '_id': req.user._id })
    if(!userInfo) return res.json({ message: `User doesn't exist!` })
    // STEP 5: render home page
    res.render('home', { userInfo: userInfo, accessToken: req.query.accesstoken })
    // res.json({ message: 'Hello World!' })
})

/* Auth Routes Export */
module.exports = router