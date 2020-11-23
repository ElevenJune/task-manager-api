const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.JWT_PASSPHRASE)
        const user = await User.findOne({_id : decoded._id, "tokens.token": token}) //find one with given id and possessing a token
        
        if(!user)
            throw new Error()
        
        req.user = user //store user to use it in next()
        req.token = token //Identify the token that was given for this session
        next()
    }catch(e){
        res.status(401).send({"error":"Please authenticate"})
    }

} 

module.exports = auth