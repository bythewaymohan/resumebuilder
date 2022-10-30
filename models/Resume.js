const mongoose = require ('mongoose');
const ResumeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    p_type:{
        type:String,
        required:true,
    },
    profile:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true    
    },
    email:{
        type:String,
        required:true,
    
    },
    linkedin:{
        type:String,
        required:true
    },
    skill:{
        type:String,
        required:true
    },
   
    project:{
        type:String,
        required:true
    },
    hobbies:{
        type:String,
        required:true,
    },
    certifi:{
        type:String,
        required:true,
    },

    edu:{
        type:String,
        required:true
    },
    exp:{
        type:String,
        required:true
    },
    lang:{
        type:String,
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type: Date,
        default:Date.now
    }
})

module.exports =  mongoose.model('Resume', ResumeSchema)
