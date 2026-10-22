const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const solutionVideo = require("../models/solutionVideo");

const createProblem = async (req,res)=>{

    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;


    try{
       
      for(const {language,completeCode} of referenceSolution){
         

        // source_code:
        // language_id:
        // stdin: 
        // expectedOutput:

        const languageId = getLanguageById(language);
          
        // I am creating Batch submission
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        const submitResult = await submitBatch(submissions);
        // console.log(submitResult);

        const resultToken = submitResult.map((value)=> value.token);

        // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
        
       const testResult = await submitToken(resultToken);

      //  console.log(testResult);

       for(const test of testResult){
        if(test.status_id!=3){
         return res.status(400).send("Error Occured");
        }
       }

      }


      // We can store it in our DB

    const userProblem =  await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      });

      res.status(201).send("Problem Saved Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}
          

const updateProblem = async(req,res)=>{
const {id}=  req.params;
const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;

try{

  if(!id){
    return res.status(400).send("Missing ID Failed");
  }
  const DsaProblem = Problem.findById(id);
  if(!DsaProblem)
  {
    return res.status(404).send("ID is Not persent in server");
  }

  for(const {language,completeCode} of referenceSolution){
         

        // source_code:
        // language_id:
        // stdin: 
        // expectedOutput:

        const languageId = getLanguageById(language);
          
        // I am creating Batch submission
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        const submitResult = await submitBatch(submissions);
        // console.log(submitResult);

        const resultToken = submitResult.map((value)=> value.token);

        // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
        
       const testResult = await submitToken(resultToken);

    //    console.log(testResult);

       for(const test of testResult){
        if(test.status_id!=3){
         return res.status(400).send("Error Occured");
        }
       }

      }

      await Problem.findByIdAndUpdate(id, {...req.body},{runValidators:true,new:true});
      res.status(200).send(newProblem);
}
catch(err){
  res.status(500).send("Error");
}


}

const deleteproblem =async(req,res)=>{
  const {id} = req.params;
  try{
    if(!id)
      return res.status(400).send("ID Missing");

   const deletedproblem=await Problem.findByIdAndDelete(id);
   if(!deletedproblem)
    return res.status(404).send("Problem is Missing");

    res.status(200).send(successsfullyDeletd);
  }
  catch(err){
    res.status(500).send("Error: " +err);
  }
}

const getProblemById = async(req,res)=>{
   const {id} = req.params;
  try{
    if(!id)
      return res.status(400).send("ID Missing");

    const getProblem = await Problem.findById(id).select(
  "_id title description difficulty tags visibleTestCases startCode referenceSolution"
);

   // video ka jo bhi url wagera le aao
   
   if(!getProblem)
    return res.status(404).send("Problem is Missing");
    const videos = await solutionVideo.find({problemId:id});

    if(videos){
      getProblem.secureUrl=videos.secureUrl;
      getProblem.thumbnailUrl=videos.thumbnailUrl;
      getProblem.duration=videos.duration;

      // console.log(getProblem);
      // console.log(getProblem.duration);

     return res.status(200).send(getProblem);
    }
    res.status(200).send(getProblem);
  }
  catch(err){
  console.error("getProblemById Error:", err);
  res.status(500).send("Error: " + err.message);
}

}


// const getProblemById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     if (!id) {
//       return res.status(400).json({ message: "ID Missing" });
//     }

//     const problem = await Problem.findById(id).select(
//       "_id title description difficulty tags visibleTestCases startCode referenceSolution"
//     );

//     if (!problem) {
//       return res.status(404).json({ message: "Problem not found" });
//     }

//     // Fetch related videos
//     const videos = await solutionVideo.find({ problemId: id });

//     return res.status(200).json({
//       ...problem.toObject(),
//       videos: videos || [],
//     });

//   } catch (err) {
//     console.error("getProblemById Error:", err);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: err.message,
//     });
//   }
// };


const getAllProblem = async (req, res) => {
  try {
    const [problems, counts] = await Promise.all([
      Problem.find({}).select('_id title difficulty tags companies').lean(),
      Submission.aggregate([{ $match: { status: { $in: ['accepted', 'wrong', 'error'] } } }, { $group: { _id: '$problemId', total: { $sum: 1 }, accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } } } }]),
    ]);
    const lookup = new Map(counts.map(row => [String(row._id), row]));
    res.json(problems.map(problem => ({ ...problem, totalSubmissions: lookup.get(String(problem._id))?.total || 0, acceptedSubmissions: lookup.get(String(problem._id))?.accepted || 0 })));
  } catch { res.status(500).json({ message: 'Unable to load problems.' }); }
};
const solvedAllProblembyUser = async (req, res) => {
  try {
    const ids = await Submission.distinct('problemId', { userId: req.result._id, status: 'accepted' });
    res.json(await Problem.find({ _id: { $in: ids } }).select('_id title difficulty tags'));
  } catch { res.status(500).json({ message: 'Unable to load solved problems.' }); }
};

// const submittedProblem = async(req,res)=>{
//   try{
//     const userId = req.result._id;
//     const problemId = req.params.pid;

//    const ans=await Submission.find({user,problemId});
//    if(ans.length==0)
//     res.status(200).send("No Submission is Present");
//    res.status(200).send(ans);
//   }
//   catch(err){
//     res.status(500).send("Internal Server Error");
//   }
// }

const submittedProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.pid;

    const ans = await Submission.find({
      userId: userId,
      problemId: problemId
    }).sort({ createdAt: -1 });

    res.status(200).json(ans);

  } catch (err) {
    console.log(err);  // very important for debugging
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteproblem,
  getProblemById,
  getAllProblem,
  solvedAllProblembyUser,
  submittedProblem
};
 




