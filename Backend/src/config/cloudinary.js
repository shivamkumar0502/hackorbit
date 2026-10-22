const cloudinary = require('cloudinary').v2;
const clean = value => String(value || '').trim().replace(/^['"]/, '').replace(/['"],?$/, '');
function configureCloudinary(){
 const cloud_name=clean(process.env.CLOUDINARY_CLOUD_NAME),api_key=clean(process.env.CLOUDINARY_API_KEY),api_secret=clean(process.env.CLOUDINARY_API_SECRET);
 if(!/^[a-z0-9_-]+$/i.test(cloud_name)||!/^\d+$/.test(api_key)||!api_secret)throw Object.assign(new Error('Cloudinary is not configured correctly. Check the three Cloudinary variables in Render.'),{statusCode:503});
 cloudinary.config({cloud_name,api_key,api_secret,secure:true});return {cloudinary,cloud_name,api_key,api_secret};
}
module.exports={configureCloudinary,clean};
