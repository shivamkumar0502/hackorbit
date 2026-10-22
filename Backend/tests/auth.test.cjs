const {test}=require('node:test');
const assert=require('node:assert/strict');
const Module=require('node:module');
const root=require('node:path').resolve(__dirname,'..');
const original=Module._load;
let foundUser=null;
const mockUser={findOne:async()=>foundUser};
Module._load=function(id,parent,...args){
 if(parent?.filename===root+'/src/controllers/userAuthent.js'){
  if(id==='../utils/tokenBlocklist') return {};
  if(id==='../models/user') return mockUser;
  if(id==='../models/submission') return {};
 }
 return original.call(this,id,parent,...args);
};
const {login}=require(root+'/src/controllers/userAuthent');
const cookie=require(root+'/src/utils/authCookie');
const bcrypt=require(root+'/node_modules/bcrypt');
function response(){return {statusCode:200,status(n){this.statusCode=n;return this},json(body){this.body=body;return this},cookie(name,value,options){this.cookieData={name,value,options};return this}}}
test('unknown email returns a controlled credentials error',async()=>{foundUser=null;const res=response();await login({body:{emailId:'missing@example.com',password:'secret'}},res);assert.equal(res.statusCode,401);assert.equal(res.body.message,'Invalid email or password');});
test('valid login returns user and httpOnly cookie',async()=>{process.env.JWT_KEY='regression-test-key';foundUser={_id:'test-user',emailId:'test@example.com',firstName:'Test',role:'user',password:await bcrypt.hash('Secret123!',4)};const res=response();await login({body:{emailId:' TEST@example.com ',password:'Secret123!'}},res);assert.equal(res.statusCode,201);assert.equal(res.body.user._id,'test-user');assert.equal(res.cookieData.options.httpOnly,true);assert.equal(res.cookieData.options.path,'/');});
test('wrong password returns 401',async()=>{const res=response();await login({body:{emailId:'test@example.com',password:'incorrect'}},res);assert.equal(res.statusCode,401);});
test('production cross-site cookie configuration',()=>{process.env.NODE_ENV='production';process.env.COOKIE_SAME_SITE='none';assert.deepEqual(cookie(),{httpOnly:true,secure:true,sameSite:'none',path:'/'});});
