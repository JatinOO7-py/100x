const mongoose=require('mongoose');

const todo=new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true,
        unique: true
    },
    completed:{
        type: Boolean,
        required: true,
        default: false
    }
});

const toDoList=mongoose.model('toDoList', todo);

console.log(mongoose.connection.readyState)

toDoList.create([{
    title:"Go To Gym",
    description:"From 6 To 9"
  },{
    title: "Go To Study",
    description:"From 9:30 to 11"
  },]).catch(error=>{console.log("Initialized Data Already Present\n"+error)});

module.exports.toDoListModel=toDoList;




