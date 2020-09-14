/* Dependencies */

// 1. Express & Routes
const router = require('express').Router()
// 2. Mongoose
const mongoose = require('mongoose')
// 3. Model
const All = require('../models/All')
// 4. JWT
const jwt = require('jsonwebtoken')
// 5. Hashing Password
const bcrypt = require('bcryptjs')
// 6. Verification
const { verifyToken, generateAccessToken } = require('../controllers/verification')

/* Routes */

// REGISTER Post Router
router.post('/register', async(req, res) => {
    
    // 1. if no data in req.body, throw an error
    if(!req.body) return res.json({ message: "No credential send!" })

    // 2. check if email already exits
    const emailExist = await All.findOne({ 'credentials.email': req.body.email })
    // - if YES, then throw error
    if(emailExist) return res.json({ message: "Email already exist!" })

    // 3. hash password with bcrypt
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // create NEW User
    const user = new All({
        credentials: {
            email: req.body.email,
            password: hashedPassword
        }
    })

    try {
        const saveNewUser = await user.save()
        res.json({ message: "User successfully saved!" })
    } catch(err) {
        res.json({ message: "Unsuccessfully save new user!" })
    }
})

// LOGIN Get Router
router.get('/', async(req, res) => {
    // get registered user email
    let registerUser = await All.findOne()
    console.log(registerUser.credentials)

    let password = 'anypassword123'
    const validPassword = await bcrypt.compare(password, registerUser.credentials.password)
    if(!validPassword) return res.json({ message: `Invalid password! Make sure you provide the correct password.` })

    res.render('login', { email: registerUser.credentials.email, password: password })
})

// LOGIN Post Router
router.post('/', async(req, res) => {
    
    // check email existance
    const userCredential = await All.findOne({ 'credentials.email': req.body.email })
    if(!userCredential) return res.json({ message: `Email deosn't exist!` })
    // check password match
    const validPassword = await bcrypt.compare(req.body.password, userCredential.credentials.password)
    if(!validPassword) return res.json({ message: `Invalid password! Make sure you insert the correct password.` })
    // 1st STEP: assign token for user
    // - access token: will automatically expire in 24 hours
    // const accessToken = jwt.sign({ _id: userCredential._id}, process.env.SECRETKEY, { expiresIn: '24h' })
    const accessToken = generateAccessToken(userCredential._id)
    // - refresh token
    const refreshToken = jwt.sign({ _id: userCredential._id}, process.env.SECRETKEY)
    // 2nd STEP: save user token in DB - blacklist
    let dateTime = new Date()
    const query = { _id: userCredential._id }
    const update = { $push: { blacklist: { accessToken: accessToken, refreshToken: refreshToken, status: 0, lastUpdate: dateTime.toUTCString() } } }
    const options = { upsert: true, new: true }
    All.updateOne(query, update, options)
    .then(response => {
        // 3rd STEP
        return res.redirect('/?accesstoken=' + accessToken)
    })
    .catch(err => res.json({ message: 'trouble saving tokens in DB!', data: err }))

    // res.json({ message: 'Everything works fine!', data: userCredential._id })
})

// LOGOUT Post Router
router.post('/logout', async (req, res) => {
    
    // 1. verify jwt token to get user ID
    let response = verifyToken(req.body.accessToken)
    
    if(response.message === 'Unsuccessful!') {
        // 2. update status in BlackList to 1 for confirm Logout
        All.findOneAndUpdate(
            { "blacklist.accessToken": req.body.accessToken },
            { "$set": { "blacklist.$.status": 1 } },
            { blacklist: { $elemMatch: { accessToken: req.body.accessToken } } }
        )
        .then(data => res.json({ message: 'Successful!', data: data }))
        .catch(err => res.json({ message: 'Unsuccessful!', error: err }))
    }
    else {
        // 2. update status in BlackList to 1 for confirm Logout
        All.updateOne(
            { _id: response.userID, "blacklist.accessToken": req.body.accessToken },
            { "$set": {
                "blacklist.$.status": 1
            } },
            (err, success) => {
                if(err) return res.json({ message: 'Unsuccessful!', error: err })
                else return res.json({ message: 'Successful!', data: success })
            }
        )
    }
})

// REFRESH TOKEN Post Router
router.post('/refreshtoken', async(req, res) => {
    
    let accessToken = req.body.accessToken
    // 1. check receive query of accessToken availability
    if(accessToken == null) return res.status(400).json({ message: 'Access Token Null!' })
    // 2. compare queried accessToken with accessToken in DB, and retrieved refreshToken if Only status = 0 in return
    let data = await All.findOneAndUpdate(
        { "blacklist.accessToken": accessToken },
        { "$set": { "blacklist.$.status": 1 } },
        { blacklist: { $elemMatch: { accessToken: accessToken } } }
    )
    
    let refreshToken = data.blacklist[0].refreshToken
    
    // 3. verify refreshToken retrieved from DB
    jwt.verify(refreshToken, process.env.SECRETKEY, (err, userID) => {
        
        if(err) return res.json({ message: 'Invalid Refresh Token!' })
        // 4. create new accessToken for user
        const accessToken = generateAccessToken(userID._id)
        // 5. save & update new accessToken in DB
        let dateTime = new Date()
        const query = { _id: userID._id }
        const update = { $push: { blacklist: { accessToken: accessToken, refreshToken: refreshToken, status: 0, lastUpdate: dateTime.toUTCString() } } }
        const options = { upsert: true, new: true}

        All.updateOne(query, update, options)
        .then(response => {
            // 6. return back fetch call to invalidtoken page
            return res.json({ message: 'Successful!', accessToken: accessToken })
        })
        .catch(err => { 
            return res.json({ message: 'trouble saving new tokens in DB!' })
        })
    })
})

// INVALID TOKEN Get Route
router.get('/invalidtoken', (req, res) => {
    res.render('auth/invalidtoken')
})

// BLACKLIST Post Router
router.post('/blacklist', async(req, res) => {
    
    let accessToken = req.body.accessToken
    // 1. check receive query of accessToken availability
    if(accessToken == null) return res.status(400).json({ message: 'Access Token Null!' })
    // 2. get status of accessToken
    let data = await All.findOne(
        { "blacklist.accessToken": accessToken },
        { blacklist: { $elemMatch: { accessToken: accessToken } } }
    )
    
    let status = data.blacklist[0].status

    // check status of accessToken
    if(+status === 0) { // - if status = 0, then
        // accessToken is NOT BLACKLISTED
        return res.json({ message: 'Not blacklisted!' })
    } else { // - if status = 0 or null, then
        // accessToken is BLACKLISTED or NO ACCESSTOKEN
        return res.json({ message: 'Blacklisted or Invalid Access Token!' })
    }
})

/* Auth Routes Export */
module.exports = router