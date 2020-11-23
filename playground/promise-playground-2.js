const Task = require('../src/models/task')

require('../src/db/mongoose')

// 5fb2cd0cdf6eba5da9434d53
// Task.findByIdAndDelete('5fb289d878eff83d0ce66159').then((result)=>{
//     console.log(result)
//     return Task.countDocuments();
// }).then((result)=>{
//     console.log("n:" +result)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskAndCount= async (id)=>{
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments();
    return count;
}

deleteTaskAndCount('5fb2885b863cc73a5a9f1346').then((res)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})