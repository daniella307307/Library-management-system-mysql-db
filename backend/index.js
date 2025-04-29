const express = require('express');
const app = express();
const cors = require('cors');

// const mongoose = require('mongoose');
require('dotenv').config()
const PORT = process.env.PORT || 5000;
const mysql = require('./config/databaseConfig');
const bodyParser = require('body-parser');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use("/api/v1/auth",require("./routes/UserRouter"));
// mongoose.connect(process.env.MONGODB_URI,
//        ).then(()=>console.log("Connected to database successfully"))
//     .catch((err)=>console.error("Database connection error: " + err));
app.listen(PORT,()=>{
    console.log(`System is running on port ${PORT}`)
})