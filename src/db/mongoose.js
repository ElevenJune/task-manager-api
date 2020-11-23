const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOOSE_URL,{
    useNewURLParser:true,
    useCreateIndex:true,
    useFindAndModify:true
})
