import { User } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";

const userController = {
    async me(req, res, next){
        try{
            const user = await User.findOne({_id: req.user._id}).select('-password -__v')   // -password and -__v is used hide the password and __v field of user data
            if(!user){  
                return new(CustomErrorHandler.notFound());
            }
            res.json(user);
        }catch(err){
            return next(err);

        }
    }

};


export default userController;