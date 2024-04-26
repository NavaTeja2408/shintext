
const uuid = require('uuid').v4;
const cloudinary = require('cloudinary').v2

const uploadFilesToCloudninery  = async(files=[]) => {
    const uploadPromises = files.map((file) => {
        return new Promise((resolve , reject) => {
            cloudinary.uploader.upload(
                getBase64(file) , {
                resource_type : "auto" ,
                public_id: uuid() ,
            },(error , result) => {
                if(error) return reject(error);
                resolve(result);
            })
        })
    })

    try {
        const results = await Promise.all(uploadPromises)
        const formattedResults = results.map((result) => ({
            public_id : result.public_id,
            url : result.secure_url ,
        }))
        return formattedResults;
    } catch (error) {
        console.lof(error)
        
    }
}


const getBase64 = (file) => 
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;


module.exports = {uploadFilesToCloudninery }