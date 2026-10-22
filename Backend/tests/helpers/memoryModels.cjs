let seq=0;
const copy=value=>value===undefined?undefined:structuredClone(value);
const equal=(a,b)=>String(a)===String(b);
function matches(doc,query){return Object.entries(query).every(([key,value])=>{
 if(key==='$or')return value.some(item=>matches(doc,item));
 const actual=doc[key];
 if(value===null)return actual===null||actual===undefined;
 if(value&&typeof value==='object'&&!(value instanceof Date))return Object.entries(value).every(([op,want])=>({$in:()=>want.some(v=>equal(actual,v)),$ne:()=>!equal(actual,want),$gte:()=>actual>=want,$lte:()=>actual<=want,$gt:()=>actual>want}[op]?.()??false));
 return equal(actual,value);
});}
function createModels(){
 const tables={Daily:[],Revision:[],Progress:[],Peer:[],Event:[],Entry:[],Problem:[],Submission:[]};
 class Query{
  constructor(run){this.run=run;this.sortBy=null;this.max=Infinity;this.field=null;}
  select(){return this;}sort(value){this.sortBy=value;return this;}limit(value){this.max=value;return this;}populate(field){this.field=field;return this;}
  async exec(){let value=copy(await this.run());if(Array.isArray(value)){if(this.sortBy){const [key,dir]=Object.entries(this.sortBy)[0];value.sort((a,b)=>a[key]>b[key]?dir:a[key]<b[key]?-dir:0);}value=value.slice(0,this.max);}
   const pop=doc=>{if(!doc)return doc;if(this.field==='problemId')doc.problemId=copy(tables.Problem.find(p=>equal(p._id,doc.problemId))||null);return doc;};return this.field?Array.isArray(value)?value.map(pop):pop(value):value;
  }
  lean(){return this.exec();}then(resolve,reject){return this.exec().then(resolve,reject);}
 }
 const models={};
 for(const name of Object.keys(tables)){
  const data=tables[name],keys={Daily:['day'],Revision:['userId','problemId'],Progress:['userId'],Peer:['invite'],Entry:['eventId','userId']}[name];
  const fresh=values=>({_id:(++seq).toString(16).padStart(24,'0'),createdAt:new Date(),...(name==='Peer'?{guest:null,guestName:'',version:0,status:'waiting',editor:'host',language:'javascript',review:''}:{}),...(name==='Progress'?{readUnits:[]}:{}),...copy(values)});
  function update(doc,ops){Object.assign(doc,copy(ops.$set||{}));for(const [key,value]of Object.entries(ops.$inc||{}))doc[key]=(doc[key]||0)+value;for(const [key,value]of Object.entries(ops.$addToSet||{}))doc[key]=[...new Set([...(doc[key]||[]),value])];for(const [key,value]of Object.entries(ops.$pull||{}))doc[key]=(doc[key]||[]).filter(v=>v!==value);}
  models[name]={
   find:q=>new Query(()=>data.filter(d=>matches(d,q||{}))),findOne:q=>new Query(()=>data.find(d=>matches(d,q))||null),findById:id=>new Query(()=>data.find(d=>equal(d._id,id))||null),
   exists:async q=>Boolean(data.find(d=>matches(d,q))),countDocuments:async q=>data.filter(d=>matches(d,q)).length,
   distinct:async(field,q)=>[...new Set(data.filter(d=>matches(d,q)).map(d=>d[field]))],
   create:async values=>{if(keys&&data.some(d=>keys.every(key=>equal(d[key],values[key]))))throw Object.assign(new Error('duplicate'),{code:11000});const doc=fresh(values);data.push(doc);return copy(doc);},
   findOneAndUpdate:(q,ops,options={})=>new Query(()=>{let doc=data.find(d=>matches(d,q));if(!doc&&options.upsert){doc=fresh({...q,...ops.$setOnInsert});data.push(doc);}if(!doc)return null;update(doc,ops);return doc;}),
   updateOne:async(q,ops,options={})=>{let doc=data.find(d=>matches(d,q));if(!doc&&options.upsert){doc=fresh({...q,...ops.$setOnInsert});data.push(doc);}if(doc)update(doc,ops);},
   deleteOne:async q=>{const index=data.findIndex(d=>matches(d,q));if(index>=0)data.splice(index,1);},
  };
 }
 return {tables,models};
}
module.exports={createModels};
