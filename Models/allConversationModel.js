const mongoose = require('mongoose')

const {Schema} = mongoose

const ConvoSchema = new Schema (
    {   
        sender_id: {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "User"
        } ,
        
        convo : [ {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "User"
        }]
        

    }
)

const ConvoModel = mongoose.model('AllConversations' , ConvoSchema)

module.exports = ConvoModel