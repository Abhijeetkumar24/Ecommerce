import  express  from "express";
import {  registerController, loginController , userController, refreshController, productController} from "../controllers/index.js";
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';


const router = express.Router();

router.post('/register', registerController.register )            

//registerController is a object and register is a function present in it . call back function (req,res)={ } ke place pr esko
// use krege code ko modular bnane ke liye register function hi call back function ka kam yha pr

router.post('/login', loginController.login);
router.get('/me', auth, userController.me);
router.post('/refresh', refreshController.refresh);
router.post('/logout', auth, loginController.logout);
router.post('/products', [auth, admin], productController.store)                  // create product
router.put('/products/:id', [auth, admin], productController.update)              // update product
router.delete('/products/:id', [auth, admin], productController.destory)          // delete product
router.get('/products', productController.index);                                 // get all product
router.get('/products/:id', productController.show)                              // get single product




export default router;



// {
    //     "username": "Abhijeet24",
    //     "email": "abhijeet@example.com",
    //     "password": "password123",
    //     "name": "Abhijeet",
    //     "bio": "Software engineer",
    //     "profileImage": "https://example.com/profile-image/john123.jpg",
    //     "created_at": "2021-01-15T09:30:00Z"
    // }