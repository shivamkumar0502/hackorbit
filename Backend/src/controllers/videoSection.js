const mongoose=require('mongoose');
const {randomUUID}=require('node:crypto');
const {configureCloudinary}=require('../config/cloudinary');
const Problem=require('../models/problem');
const SolutionVideo=require('../models/solutionVideo');
const valid=id=>typeof id==='string'&&mongoose.isValidObjectId(id);
function fail(res,error){const status=error.statusCode||error.http_code||error.error?.http_code;return res.status(error.statusCode||503).json({message:error.statusCode?error.message:[401,403].includes(status)?'Cloudinary rejected its credentials. Update the Cloudinary variables in Render.':status===404?'Cloudinary could not find the uploaded video. Retry the upload.':'Video service is unavailable. Please retry.'});}
async function generateUploadSignature(req,res){
 try{const {problemId}=req.params;if(!valid(problemId))return res.status(400).json({message:'Invalid problem ID.'});if(!await Problem.exists({_id:problemId}))return res.status(404).json({message:'Problem not found.'});
 const {cloudinary,cloud_name,api_key,api_secret}=configureCloudinary(),timestamp=Math.floor(Date.now()/1000),public_id=`hackorbit/solutions/${problemId}/${req.result._id}/${randomUUID()}`;
 const signature=cloudinary.utils.api_sign_request({timestamp,public_id},api_secret);
 res.json({signature,timestamp,public_id,api_key,cloud_name,upload_url:`https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`});
 }catch(error){fail(res,error);}
}
async function saveVideoMetadata(req,res){
 try{const {problemId,cloudinaryPublicId}=req.body||{};
 if(!valid(problemId)||typeof cloudinaryPublicId!=='string'||!new RegExp(`^hackorbit/solutions/${problemId}/${req.result._id}/[a-f0-9-]{36}$`).test(cloudinaryPublicId))return res.status(400).json({message:'Invalid upload reference. Upload the video again from this problem page.'});
 if(!await Problem.exists({_id:problemId}))return res.status(404).json({message:'Problem not found.'});
 const {cloudinary}=configureCloudinary(),asset=await cloudinary.api.resource(cloudinaryPublicId,{resource_type:'video',media_metadata:true});
 if(asset.resource_type!=='video'||asset.public_id!==cloudinaryPublicId||!Number.isFinite(asset.duration)||asset.duration<0||asset.bytes>100*1024*1024||!/^https:\/\//.test(asset.secure_url||''))return res.status(400).json({message:'The uploaded asset must be a valid video of at most 100 MB.'});
 const thumbnailUrl=cloudinary.url(asset.public_id,{resource_type:'video',format:'jpg',secure:true,transformation:[{width:400,height:225,crop:'fill'},{start_offset:'0'}]});
 const video=await SolutionVideo.findOneAndUpdate({cloudinaryPublicId},{$setOnInsert:{problemId,userId:req.result._id,cloudinaryPublicId,secureUrl:asset.secure_url,duration:asset.duration,thumbnailUrl}},{upsert:true,new:true,runValidators:true});
 res.json({message:'Video uploaded and attached to the problem.',videoSolution:{id:video._id,secureUrl:video.secureUrl,thumbnailUrl:video.thumbnailUrl,duration:video.duration,uploadedAt:video.createdAt}});
 }catch(error){fail(res,error);}
}
async function deleteVideo(req,res){
 try{const {problemId}=req.params;if(!valid(problemId))return res.status(400).json({message:'Invalid problem ID.'});
 const video=await SolutionVideo.findOne({problemId}).sort({createdAt:-1});if(!video)return res.status(404).json({message:'Video not found.'});
 const {cloudinary}=configureCloudinary();const result=await cloudinary.uploader.destroy(video.cloudinaryPublicId,{resource_type:'video',invalidate:true});if(!['ok','not found'].includes(result.result))return res.status(503).json({message:'Cloudinary could not delete the video. Retry.'});
 await SolutionVideo.deleteOne({_id:video._id});res.json({message:'Video deleted.'});
 }catch(error){fail(res,error);}
}
module.exports={generateUploadSignature,saveVideoMetadata,deleteVideo};
