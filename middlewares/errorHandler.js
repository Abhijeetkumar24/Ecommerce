import { DEBUG_MODE } from "../config/index.js";
import joi from "joi";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
const {ValidationError} =joi;


function errorHandler(err, req, res, next) {
    // next middle ko attached krne ke liye
    let statusCode = 500; //default status
    console.error(err);
    let data = {
        message: 'Internal server error',
        ...(DEBUG_MODE ==='true' && { originalError: err.message }) // true in string because .env contain value in string format 
        // ... spread operator hai or ye check krega condition ki agar debug mode true hai tb hi original message 
        // mtlb ki complete error details ko data oject me add krega wrna nhi
    };

    if (err instanceof ValidationError) {          // error JOI se aa rha ?
        statusCode = 422;                          //validation error
        data = {
            message: err.message
        };
    }

    if(err instanceof CustomErrorHandler){
        statusCode= err.status;
        data={
            message: err.message
        }
    }

    return res.status(statusCode).json(data);

}

  
export default errorHandler; 