class CustomErrorHandler extends Error {      //Error is inbuilt error handler class of javascript(inheritance)
    constructor(status, msg){
        super();                            // calling parent class constructure necessary in inheritance
        this.status = status;             //storing in locall varibale
        this.message = msg;
    }
    static alreadyExist(message) {        // static method is used to call the method without creating the object of class
        return new CustomErrorHandler(409, message);      // creating the new object with status 409 and message
    }


    static wrongCredentials(message = 'Username or pasword is wrong') {        
        return new CustomErrorHandler(401, message);      
    }

    static unAuthorized(message = 'unAuthorized') {        
        return new CustomErrorHandler(401, message);      
    }

    static notFound(message = '404 Not Found') {        
        return new CustomErrorHandler(404, message);      
    }

    static serverError(message = 'Internal server error') {        
        return new CustomErrorHandler(505, message);      
    }



}

export default CustomErrorHandler;