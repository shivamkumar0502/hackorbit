






        






const express = require('express')
const app = express();
const path = require('node:path');
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


app.use(cors({
    origin: (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(url => url.trim()),
    credentials: true
}));

app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/api/auth', authRouter);
app.use('/user', profileRoutes);
app.use('/api/user', profileRoutes);
app.use('/problem', problemRouter);
app.use('/api/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/api/submission', submitRouter);
app.use('/ai', aiRouter);
app.use('/api/ai', aiRouter);
app.use('/video', videoRouter);
app.use('/api/video', videoRouter);
app.use('/interview', interviewRoutes);
app.use('/api/interview', interviewRoutes);
app.use("/uploads", express.static("uploads"));


app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
const frontendDir = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDir));
app.get('/{*path}', (req, res, next) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ message: 'Route not found' });
    res.sendFile(path.join(frontendDir, 'index.html'));
});

const InitalizeConnection = async ()=>{
    try{
        await Promise.all([main(), redisClient.connect()]);
        console.log("DB Connected");

        app.listen(process.env.PORT || 5000, '0.0.0.0', ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })
    }
    catch(err){
        console.error('Startup failed:', err.message);
        process.exit(1);
    }
}

InitalizeConnection();
