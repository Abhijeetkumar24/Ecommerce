
import mongoose, { Schema } from "mongoose";

const refreshTokenSchema =new Schema ({              
   token: {type: String, unique: true}     // unique true add indexes help in fast searching
}, {timestamp: false});                   


export default mongoose.model('RefreshToken', refreshTokenSchema, 'refreshTokens');
