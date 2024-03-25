const fs=require('fs');
const express=require('express');
const morgan=require('morgan')
const app=express();
const types=require('./types.js');
const createTodo=types.createTodo;
const updateTodo=types.updateTodo;
const jsonStringify = require('json-stringify-safe');
const cors=require('cors')
app.use(cors())

const mongoose=require('mongoose');
app.use(morgan('dev'));

mongoose.connect("mongodb://soni1822004:SHaiA4ijbl0yhrE5@ac-hfeiuws-shard-00-00.kibmnox.mongodb.net:27017,ac-hfeiuws-shard-00-01.kibmnox.mongodb.net:27017,ac-hfeiuws-shard-00-02.kibmnox.mongodb.net:27017/ToDo?ssl=true&replicaSet=atlas-6u96t6-shard-0&authSource=admin&retryWrites=true&w=majority")
.then(con=>{
    // console.log(con.connections);
    console.log("DB Connect Sucessfull");
}).catch(err=>console.log(err));
const toDoListModel=require('./db.js').toDoListModel;

// const cors = require('cors');
// app.use(cors())
app.use(express.json());

app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   // Set allowed headers
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   // Continue to the next middleware
  console.log(req.body);
    next();
})

app.post('/todo',async (req,res)=>{
    const createPayload=req.body;
    const parsedPayload=createTodo.safeParse(createPayload);
    if(!parsedPayload.success){
        res.status(401).json({
            msg: "Yoy sent the wrogn inputs",
        })
        return
    }
    else {
        try
            {    
                console.log("POST REQUEST RECIEVED")
                console.log(req.body);
                const newToDo=await toDoListModel.create(req.body);
                const allTodo=await toDoListModel.find();
                console.log(newToDo);
                res
                .status(200)
                .header({
                    "Access-Control-Allow-Origin": "*",
                })
                .json({
                    status: 'Sucess',
                    newToDo,allTodo
                })}
        catch(error){
            const allTodo=await toDoListModel.find();
            // console.log(error);
            res
            .status(400)
            .json({
                status: 'Failed',
                error, allTodo
            })
        }
    }
    //put it in mongodb
})

app.get('/todos', async (req,res)=>{
    try
        {    
        let query= toDoListModel.find()
        let sortby={"completed":-1}
        // query=query.sort(sortby);
        // const jsonString = jsonStringify(allTodo);
        // console.log(allTodo[0]);
        const allTodo=await query;
        res
        .status(200)
        .header({
            "Access-Control-Allow-Origin": "*",
        })
        .json({
            status: 'Sucess',
            allTodo
        })}
    catch(error){
        console.log(error);
        res
        .status(400)
        .json({
            status: 'Failed',
            error
        })
    }
})


app.put('/completed',async (req,res)=>{
    const createPayload=req.body;
    const parsedPayload=updateTodo.safeParse(createPayload);
    if(!parsedPayload.success){
        res.status(401).json({
            msg: "Wrong ID has been send",
        })
        return;
    }
    //else make some changes in the db
    else {
        console.log(req.body.id)
        const UpdatedToDo=await toDoListModel.findByIdAndUpdate(req.body.id,{completed: true});
        res
            .status(200)
            .json({
                Status: 'Sucesss',
                UpdatedToDo
            })

    }
    
})

app.listen(8007,()=>{
    console.log("Listening started");
})