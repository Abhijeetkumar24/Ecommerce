import mongoose, { Schema } from "mongoose";
import { APP_URL } from '../config/index.js'

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    image: {
        type: String, required: true, get: (image) => {                      // get will run when we fetch product document it append app_url (domain name) to image path so that we view image on chrome
            return `${APP_URL}/${image}`;                                    // APP_URL in .env
        }
    },
}, { timestamp: true , toJSON: {getters:true }, id: false });                // use getter to this model   , also use express.static middleware in server.js
                                                // in this we get 2 time id id and _id so remove 1 id 


export default mongoose.model('Product', productSchema, 'products');
