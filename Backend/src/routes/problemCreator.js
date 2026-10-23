const express = require('express');

const problemRouter =  express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const {createProblem,updateProblem,deleteproblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem} = require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware");


problemRouter.post('/install-core', adminMiddleware, async(req,res)=>{try{res.json(await require('../services/installPracticeProblems')({force:true}));}catch{res.status(500).json({message:'Unable to install the practice library. Please retry.'});}});

// Create
problemRouter.post("/create",adminMiddleware ,createProblem);
problemRouter.put("/update/:id",adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware, deleteproblem);


problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem",userMiddleware, getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware, solvedAllProblembyUser);
// problemRouter.get("submittedProblem/:pid",userMiddleware,submittedProblem)
problemRouter.get("/submittedProblem/:pid", userMiddleware, submittedProblem);

module.exports = problemRouter;

// fetch
// update
// delete 