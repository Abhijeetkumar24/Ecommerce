// admin role base middleware

import { User } from "../models/index.js"
import CustomErrorHandler from "../services/CustomErrorHandler.js";

const admin = async(req, res, next) => {
    try{
        const user = await User.findOne({_id: req.user._id})

        if(user.role === 'admin'){
            next();                                                         // next ke andar kuch nhi hai to next middleware ko call kr dege                                  
        }else{
            return next(CustomErrorHandler.unAuthorized());                 // next ke andar kuch pass krege mtlb kuch error hai 
        }
    }catch(err){
        return next(CustomErrorHandler.serverError());
    }
}

export default admin;