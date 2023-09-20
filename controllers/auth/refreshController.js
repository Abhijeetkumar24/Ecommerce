import Joi from "joi";
import { REFRESH_SECRET } from "../../config/index.js";
import { RefreshToken, User } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import jwtService from "../../services/JwtService.js";

const refreshController = {
    async refresh(req, res, next) {

        // validate
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });

        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        // database
        let refreshtoken
        try {                     // model                          //postman
            refreshtoken = await RefreshToken.findOne({ token: req.body.refresh_token })
            if (!refreshtoken) {
                return nest(CustomErrorHandler.unAuthorized('Invalid refresh token '))
            }
             

            let userId;
            try {
                const { _id } = await jwtService.verify(refreshtoken.token, REFRESH_SECRET);
                userId = _id;

            } catch (err) {

                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'))
            }


            const user = User.findOne({ _id: userId });
            if (!user) {
                return next(CustomErrorHandler.unAuthorized('No user found'));
            }

            //
            const access_token = jwtService.sign({ _id: user._id, role: user.role });

            const refresh_token = jwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);     // phir se refresh token create krege
            await RefreshToken.create({ token: refresh_token });                                                 // refresh token ko database me store kr dege

            res.json({ access_token, refresh_token });

        } catch (err) {
            return next(new Error('something went wrong' + err.message));
        }
    }

}

export default refreshController; 