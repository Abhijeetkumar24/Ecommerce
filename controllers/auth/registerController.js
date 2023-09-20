import Joi from "joi";             // data validation me kam aata hai ki wo valid hai ya nhi like data type,length
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import { RefreshToken, User } from '../../models/index.js';
import bcrypt from 'bcrypt';
import jwtService from "../../services/JwtService.js"; 
import { REFRESH_SECRET } from "../../config/index.js";

const registerController = {
    async register(req, res, next) {       //next is used to pass controll to middleware 

        //validation
        const registerSchema = Joi.object({             // schema bnayege joi ka use kr ke 
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        })


        const { error } = registerSchema.validate(req.body);        //schema ka use kr ke validate krege request ke body ko 

        if (error) {
            return next(error);   //next method me error ko send kr rhe , here we sending error to errorHandler middle ware
            // throw error;        async/await method se throw kiya hua error middle ware handle nhi kr pata
            // yha hm direct res.json({mes: "error"}) nhi likhege error ko handle krne ke liye middleware bnayege 
        }

        // check if user is in the databse already 
        try {
            const exist = await User.exists({ email: req.body.email });      //exists is mongodb function check if email is 
            if (exist) {                                                     // alredy present or not.
                return next(CustomErrorHandler.alreadyExist('This email is already taken')); // creating custom error handler // dont throw or print error just send it to 
            }                                                              // global errorHandler middle ware using next
        }
        catch (err) {
            return next(err);

        }

        const { name, email, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);   //bcrypt is used to encrypt password and 10 is 
        // number of iteration to preform form hash code


        const user = new User({           //Prepare the model
            name: name,
            email: email,
            password: hashedPassword
        });

        let access_token;
        let refresh_token;
        try {
            const result = await user.save();
            console.log(result);
            //Token
            access_token = jwtService.sign({ _id: result._id, role: result.role })
            // class.method  imported , id automaticlly assign by mongodb

            refresh_token = jwtService.sign({_id: result._id, role:result.role}, '1y', REFRESH_SECRET);
            
            // database whitelist (adding refresh token to the refresh token model)
            await RefreshToken.create({token: refresh_token});
            
        } catch (err) {
            return next(err);
        }

        res.json({ access_token, refresh_token })
    }
}


export default registerController;
                // object export