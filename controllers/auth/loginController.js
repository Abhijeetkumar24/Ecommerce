import Joi from "joi";
import { RefreshToken, User } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import bcrypt from 'bcrypt';
import jwtService from '../../services/JwtService.js';
import { REFRESH_SECRET } from "../../config/index.js";

const loginController = {
    async login(req, res, next) {
        // validation

        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        });

        const { error } = loginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            //compare the password

            const match = await bcrypt.compare(req.body.password, user.password);

            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            // Token 
            const access_token = jwtService.sign({ _id: user._id, role: user.role });

            const refresh_token = jwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);
            await RefreshToken.create({ token: refresh_token });                                   // refresh token ko data base me store krna hai

            res.json({ access_token, refresh_token });

        } catch (err) {
            return next(err);

        }

    },



    async logout(req, res, next) {

        // validate
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });

        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }


        try {
            const result = await RefreshToken.deleteOne({ token: req.body.refresh_token });

            if (result.deletedCount === 0) {
              // No document was deleted; the token doesn't exist
              return res.status(404).json({ message: 'Token not found' });
            }
        

        } catch (err) {
            return next(new Error('Somenthing went wrong in the database'));
        }

        res.json({status: 1, message: 'User logout successful'});
    }

};


export default loginController;