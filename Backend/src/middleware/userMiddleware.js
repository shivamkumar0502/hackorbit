const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis")

const userMiddleware = async (req,res,next)=>{

    try{

        const {token} = req.cookies;
        if(!token)
            throw new Error("Token is not persent");

        const payload = jwt.verify(token,process.env.JWT_KEY);

        const {_id} = payload;

        if(!_id){
            throw new Error("Invalid token");
        }

        const result = await User.findById(_id);

        if(!result){
            throw new Error("User Doesn't Exist");
        }

        // Redis ke blockList mein persent toh nahi hai

        const IsBlocked = await redisClient.exists(`token:${token}`);

        if(IsBlocked)
            throw new Error("Invalid Token");

        req.result = result;


        next();
    }
    catch(err){
        res.status(401).send("Error: "+ err.message)
    }

}


module.exports = userMiddleware;


// const jwt = require("jsonwebtoken");
// const User = require("../models/user");
// const redisClient = require("../config/redis");

// const userMiddleware = async (req, res, next) => {
//   try {
//     // 🔥 DEBUG
//     console.log("COOKIES:", req.cookies);

//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({ message: "Token not present" });
//     }

//     // Verify JWT
//     const payload = jwt.verify(token, process.env.JWT_KEY);

//     const { _id } = payload;

//     if (!_id) {
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     // Find user
//     const user = await User.findById(_id);

//     if (!user) {
//       return res.status(404).json({ message: "User does not exist" });
//     }

//     // 🔥 Redis blocklist check
//     const isBlocked = await redisClient.exists(`token:${token}`);

//     if (isBlocked) {
//       return res.status(401).json({ message: "Token is blocked" });
//     }

//     // ✅ IMPORTANT FIX
//     req.user = user;     // 👈 controller ke liye
//     req.token = token;   // optional (future use)

//     next();

//   } catch (err) {
//     console.error("MIDDLEWARE ERROR:", err.message);
//     return res.status(401).json({ message: err.message });
//   }
// };

// module.exports = userMiddleware;