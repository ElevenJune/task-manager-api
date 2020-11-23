const express = require('express')
const { findById } = require('./../models/user')
const User = require('./../models/user')
const auth = require('../middleware/authentification')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelationEmail } = require('./../emails/account')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body) //Create new user from body

    try{
        await user.save()
        //sendWelcomeEmail(user.email, user.name) //No need to wait the promise
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e.message)
    }

})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.send({user,token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req,res)=>{ //GET because we want to read
    res.send(req.user)
})

router.patch('/users/me',auth,async (req,res)=>{//Patch method
    const updates = Object.keys(req.body) //get body keys
    const allowed = ["name","password","age","email"] //type allowed keys to me modified
    const isValidOperation = updates.every((update)=>allowed.includes(update)) //Check that every key is valid

    if(!isValidOperation)
        return res.status(400).send({error:"Invalid updates"})
    try{
        const user = req.user
        updates.forEach((update) => user[update]=req.body[update])
        await user.save()
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/users/me',auth, async (req,res)=>{//Delete method
    try{
        await req.user.remove()
        sendCancelationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e.message)
    }
})

const upload = multer({
    limits : {
        fileSize:1000000 //Bytes
    },
    fileFilter(req,file,callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
            return callback(new Error('Extention not accepted, must be jpg, jpeg or png'))
        callback(undefined,true) //Accept
    }
})

//Register middleware as upload.single('Name Of The Key To Use In Postman')
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width : 250, height : 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar',auth, async (req,res)=>{
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.get("/users/:id/avatar",async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
             throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)

    }catch(error){
        res.status(404).send()
    }
})

module.exports = router