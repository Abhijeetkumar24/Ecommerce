import { Product } from "../models/index.js"
import multer from "multer";
import path from 'path';
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import fs from 'fs';
import Joi from 'joi';
import productSchema from "../validators/productValidator.js";
import { APP_URL } from '../config/index.js'

const storage = multer.diskStorage({                                                    // Multer Storage Configuration
    destination: (req, file, cb) => cb(null, 'uploads/'),                               // location to store file make 'uploads' folder
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;       // make file name
        // 3746674586-836534453.png                                                     // extension name

        cb(null, uniqueName)
    }
})

const handleMultipartData = multer({ storage, limits: { fileSize: 1000000 * 5 } }).single('image')                        // handleMultipartData Middleware: This middleware is created using multer and is responsible for handling multipart form data, including file uploads. 
// 5 mb                    // key in postman

const productController = {

    async store(req, res, next) {
        // multipart form data
        handleMultipartData(req, res, async (err) => {                                 // ye line call krte hi file upload ho jayega
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }

            const filePath = req.file.path;                                           // uploaded file ka path


            const { error } = productSchema.validate(req.body);
            if (error) {
                // delete the uploaded file if joi validation fail 
                fs.unlink(`${appRoot}/${filePath}`, (err) => {                      // filePath = uploads/filename.png, appRoot is global dirname register in serve.js
                    if (err) {
                        return next(CustomErrorHandler.serverError(err.message));
                    }
                });

                return next(error);
            }

            const { name, price, size } = req.body;
            let document;

            try {
                document = await Product.create({
                    name,
                    price,
                    size,
                    image: filePath                                                   // database me uplaoded file ka path store krege 
                })
            } catch (err) {
                return next(err)

            }

            res.status(201).json(document)

        });

    },



    update(req, res, next) {
        // multipart form data
        handleMultipartData(req, res, async (err) => {                              // ye line call krte hi file upload ho jayega        
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }

            let filePath
            if (req.file) {                                                         // agar request me file(image) hoga to uska path nikalege
                filePath = req.file.path;
            }


            const { error } = productSchema.validate(req.body);
            if (error) {

                if (req.file) {                                                         // agar file hoge tb hi delete krege
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {                      // filePath = uploads/filename.png, appRoot is global dirname register in serve.js
                        if (err) {
                            return next(CustomErrorHandler.serverError(err.message));
                        }
                    });

                    return next(error);
                }
            }

            const { name, price, size } = req.body;
            console.log(name, price, size);
            let document;

            try {
                document = await Product.findOneAndUpdate({ _id: req.params.id }, {
                    name,
                    price,
                    size,
                    ...(req.file && { image: filePath })                   // optional hai ye field agar req me file hoga to esko add kr dege { image: filePath } using spreed operator
                }, { new: true });
            } catch (err) {
                return next(err)

            }
            console.log(document)

            res.status(201).json(document)

        });

    },



    async destory(req, res ,next){
        const document = await Product.findOneAndRemove({ _id: req.params.id })

        if(!document){
            return next(new Error('Nothing to delete'));
        }

        // image delete (because after document delete we don't need to keep the image in the server)

        const imagePath = document._doc.image;             // here we use _doc so that we get value of (original product document) image field without the getter which add domain  
        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if(err){
                return next(CustomErrorHandler.serverError());
            }
        });

        res.json(document)
    },


    // Get all 
    async index(req, res, next){
        let documents;

        try{
            documents = await Product.find().select('-__v').sort({ _id: -1});           // sort in decending order 
        }catch(err){
            return next(CustomErrorHandler.serverError());
        }

        return res.json(documents)
    },


    
    async show( req, res, next) {
        let document;
        try{

            document = await Product.findOne({ _id: req.params.id.trim()}).select('-updatedAt -__v');
        }catch(err){
            console.log(err)
            return next(CustomErrorHandler.serverError());
        }
        
        return res.json(document)
    }


}

export default productController;