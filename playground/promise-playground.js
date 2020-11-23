const User = require('../src/models/user')

require('../src/db/mongoose')

// 5fb2cd0cdf6eba5da9434d53

//Avant
User.findByIdAndUpdate('5fb1bf56b44b129e2acf8493',{age : 1}).then((user)=>{
    console.log(user)
    return User.countDocuments({age:1})
}).then((r)=>{
    console.log(r)
}).catch((e)=>{
    console.log(e)
})

//Après
const updateAgeAndCount = async (id,age) => {
    const user = await User.findByIdAndUpdate(id,{age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount('5fb1bf56b44b129e2acf8493',2).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})