const mongoose = require('mongoose')

const {Schema} = mongoose

const UserSchema = new Schema (
    {   
        username: {
            type : String
        } ,
        email : {
            type : String ,
            // unique : true ,
            // required : true
        }
        ,

        password : {
            type : String ,
        },

        avatar : {
            public_id : {
                type : String ,
                required : true
            } , 
            url:{
                type : String ,
                required : true
            }
        }
        

    }
)

const UserModel = mongoose.model('User' , UserSchema)

module.exports = UserModel