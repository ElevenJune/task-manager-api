const express = require('express')
const { ReplSet } = require('mongodb')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const PORT = process.env.PORT

app.use(express.json()) //Transform requests to json
app.use(userRouter)
app.use(taskRouter)

app.listen(PORT,()=>{console.log("Server running on "+ PORT)})