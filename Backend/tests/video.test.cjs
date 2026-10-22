const {test}=require('node:test');const assert=require('node:assert/strict');const Module=require('node:module');const original=Module._load;
let signed,config,created,deleted=false,providerFailure=false;const assets=new Map();
const cloudinary={config:value=>config=value,utils:{api_sign_request:(params,secret)=>{signed={params,secret};return 'signed';}},api:{resource:async id=>{if(providerFailure)throw {http_code:401};return assets.get(id);}},url:id=>`https://cdn.example/${id}.jpg`,uploader:{destroy:async()=>({result:'ok'})}};
const Video={findOneAndUpdate:async(q,u)=>created||(created={...u.$setOnInsert,_id:'video',createdAt:new Date()}),findOne:()=>({sort:()=>Promise.resolve(created)}),deleteOne:async()=>{deleted=true;}};
Module._load=function(id,parent,...args){if(parent?.filename.endsWith('/config/cloudinary.js')&&id==='cloudinary')return {v2:cloudinary};if(parent?.filename.endsWith('/controllers/videoSection.js')){if(id==='../models/problem')return {exists:async()=>true};if(id==='../models/solutionVideo')return Video;}return original.call(this,id,parent,...args);};
const {generateUploadSignature,saveVideoMetadata,deleteVideo}=require('../src/controllers/videoSection');Module._load=original;
const id='a'.repeat(24),user='b'.repeat(24);const res=()=>({statusCode:200,status(n){this.statusCode=n;return this;},json(data){this.data=data;return this;}});
test('signed video upload uses normalized settings, matching public_id and verified provider metadata',async()=>{
 process.env.CLOUDINARY_CLOUD_NAME='"demo",';process.env.CLOUDINARY_API_KEY='"123",';process.env.CLOUDINARY_API_SECRET='"secret",';
 const signature=res();await generateUploadSignature({params:{problemId:id},result:{_id:user}},signature);assert.equal(signature.statusCode,200);assert.equal(config.cloud_name,'demo');assert.equal(signed.secret,'secret');assert.equal(signature.data.public_id,signed.params.public_id);assert.match(signature.data.upload_url,/\/demo\/video\/upload$/);
 const publicId=signature.data.public_id;assets.set(publicId,{public_id:publicId,resource_type:'video',duration:12,bytes:200,secure_url:'https://cdn.example/verified.mp4'});
 const body={problemId:id,cloudinaryPublicId:publicId,secureUrl:'https://attacker.invalid',duration:999};const saved=res();await saveVideoMetadata({body,result:{_id:user}},saved);assert.equal(saved.statusCode,200);assert.equal(created.secureUrl,'https://cdn.example/verified.mp4');assert.equal(created.duration,12);
 const again=res();await saveVideoMetadata({body,result:{_id:user}},again);assert.equal(again.data.videoSolution.id,'video');
 const foreign=res();await saveVideoMetadata({body,result:{_id:'c'.repeat(24)}},foreign);assert.equal(foreign.statusCode,400);
 providerFailure=true;const failed=res();await saveVideoMetadata({body,result:{_id:user}},failed);assert.equal(failed.statusCode,503);assert.match(failed.data.message,/credentials/);providerFailure=false;
 const removed=res();await deleteVideo({params:{problemId:id},result:{_id:user}},removed);assert.equal(removed.statusCode,200);assert.equal(deleted,true);
});
test('problem editorial response includes the latest video on a plain JSON object',async()=>{
 let usedLean=false;const initial=Module._load;
 Module._load=function(id,parent,...args){if(parent?.filename.endsWith('/controllers/userProblem.js')){if(id==='../models/problem')return {findById:()=>({select:()=>({lean:async()=>{usedLean=true;return {_id:'problem',title:'A problem'};}})})};if(id==='../models/solutionVideo')return {findOne:()=>({sort:async()=>({secureUrl:'https://cdn.example/latest.mp4',thumbnailUrl:'https://cdn.example/poster.jpg',duration:12})})};}return initial.call(this,id,parent,...args);};
 const {getProblemById}=require('../src/controllers/userProblem');Module._load=initial;
 const response={status(n){this.statusCode=n;return this;},send(data){this.data=data;return this;}};await getProblemById({params:{id:'a'.repeat(24)}},response);assert.equal(usedLean,true);assert.equal(response.data.secureUrl,'https://cdn.example/latest.mp4');
});
