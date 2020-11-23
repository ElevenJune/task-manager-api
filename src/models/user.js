const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        trim:true
    },
    age: {
        type: Number,
        validate(value){
            if(value<0)
                throw new Error("Age must be positive")
        },
        default:0
    },
    email:{
        type: String,
        required :true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error("Email not valid")
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.includes('password'))
            throw new Error("password cannot contain password")
        }
    },tokens : [{
        token: {
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id', //What Identifies the object (user) in its schema
    foreignField: 'owner' //What identifies the object in the linked Schema (task)
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = await jwt.sign({_id:user._id.toString()},process.env.JWT_PASSPHRASE)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token;
}

userSchema.methods.toJSON = function() {
    const user = this
    const userPublic = user.toObject();

    delete userPublic.password
    delete userPublic.tokens
    delete userPublic.avatar

    return userPublic;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user)
        throw new Error("Unable to login")

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch)
        throw new Error("Unable to login")

    return user;
}

//To do a binding of what to do before (pre) save
//We don't use an arrow function because it doesn't bind to this
userSchema.pre('save', async function (next) {
    const user = this;
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password,8)
    }
    //Calls the next operation to do
    next();
})

//Call before deleting user (to remove its tasks)
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({owner:user._id})
    //Calls the next operation to do
    next();
})

const User = mongoose.model('User',userSchema)

module.exports = User