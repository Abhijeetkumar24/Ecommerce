import {JWT_SECRET} from '../config/index.js';
import  jwt  from "jsonwebtoken";

class jwtService {                       //use to encrypt and decrypt
    static sign(payload, expiry='1hr',secret= JWT_SECRET ) {         //payload means data to be decrypt here id and role, sign is user define
        return jwt.sign(payload, secret, {expiresIn: expiry});       // this sign is method of jwt
    }

    static verify(token ,secret= JWT_SECRET ) {         //payload means data to be decrypt here id and role
        return jwt.verify(token, secret);
    }
}

export default jwtService;