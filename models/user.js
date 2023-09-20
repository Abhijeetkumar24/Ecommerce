import mongoose, { Schema } from "mongoose";

  // schema mtlb blueprint, hmara document databse me kaise dikhna chahiye

const userSchema =new Schema ({              
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    role: {type:String, default: 'customer'},
}, {timestamp: true});                   // timestamp true means include created_at and updated_at in table



export default mongoose.model('User', userSchema, 'users');
                            // model ,schemaName,  name of collection(table) (optional) if not then pural of model is set