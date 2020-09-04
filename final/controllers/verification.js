/* Dependencies */

// 1. JWT
const jwt = require('jsonwebtoken')

// STEP 4: verify user before tasking
function verifyUser(req, res, next) {
    const accessToken = req.query.accesstoken
    // if(!accessToken) return res.json({ message: 'Access Denied!' })
    if(!accessToken) return res.render('auth/accessdenied')

    try {

        // verify the exist token
        const varified = jwt.verify(accessToken, process.env.SECRETKEY)
        req.user = varified
        next()
    } catch(err) {
        // return res.json({ message: 'Invalid token!' })
        res.redirect('/auth/invalidtoken')
    }
}

// verify token
function verifyToken(accessToken) {
    // const varified = jwt.verify(accessToken, process.env.TOKEN_4LOGINUSER)
    // return varified
    return jwt.verify(accessToken, process.env.SECRETKEY, (err, userID) => {
        // console.log('pass 1 err')
        if(err) return { message: 'Unsuccessful!' }
        else return { message: 'Successful!', userID: userID._id }
    })
}

// generate access token
function generateAccessToken(userID) {
    return jwt.sign({ _id: userID}, process.env.SECRETKEY, { expiresIn: '5s' })
}

module.exports = {
    verifyUser,
    verifyToken,
    generateAccessToken
}