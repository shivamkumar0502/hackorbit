// const express = require('express')
// const app = express();
// require('dotenv').config();
// const main =  require('./config/db')
// const cookieParser =  require('cookie-parser');
// const authRouter = require("./routes/userauth");
// const redisClient = require('./config/redis');
// const problemRouter = require("./routes/problemCreator");
// const submitRouter = require("./routes/submit")
// const aiRouter = require("./routes/aiChatting")
// const videoRouter = require("./routes/videoCreator");
// const profileRoutes = require("./routes/profile");
// const interviewRoutes = require("./routes/interview");

// const cors = require('cors')

// // console.log("Hello");

// app.use(cors({
//     origin: '*',
//     credentials: true 
// }));


// app.use(express.json());
// app.use(cookieParser());

// app.use('/user',authRouter);
// app.use('/problem',problemRouter);
// app.use('/submission',submitRouter);
// app.use('/ai',aiRouter);
// app.use("/video",videoRouter);
// app.use("/user", profileRoutes);
// app.use("/interview", interviewRoutes);
// app.use("/uploads", express.static("uploads"));
// app.use("/user", profileRoutes);
// const InitalizeConnection = async ()=>{
//     try{

//         await Promise.all([main(),redisClient.connect()]);
//         console.log("DB Connected");
        
//         app.listen(process.env.PORT, ()=>{
//             console.log("Server listening at port number: "+ process.env.PORT);
//         })

//     }
//     catch(err){
//         console.log("Error: "+err);
//     }
// }


// InitalizeConnection();



const express = require('express')
const app = express();
require('dotenv').config();

const main = require('./config/db')
const cookieParser = require('cookie-parser');
const cors = require('cors')

const authRouter = require("./routes/userauth");
const profileRoutes = require("./routes/profile");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit")
const aiRouter = require("./routes/aiChatting")
const videoRouter = require("./routes/videoCreator");
const interviewRoutes = require("./routes/interview");
const redisClient = require('./config/redis');


// ✅ FIXED CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ CLEAN ROUTES
app.use('/auth', authRouter);
app.use('/user', profileRoutes);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use('/video', videoRouter);
app.use('/interview', interviewRoutes);
app.use("/uploads", express.static("uploads"));


// ✅ SERVER START
const InitalizeConnection = async ()=>{
    try{
        await Promise.all([main(), redisClient.connect()]);
        console.log("DB Connected");

        app.listen(process.env.PORT, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })
    }
    catch(err){
        console.log("Error: "+err);
    }
}

InitalizeConnection();