// ak hi file se sare  controllers ko handle krne ke  liye index.js file yhi se sare import export hoge

export { default as registerController } from './auth/registerController.js';
                        // name
export { default as loginController } from './auth/loginController.js';
export { default as userController } from './auth/userController.js';
export { default as refreshController } from './auth/refreshController.js'
export { default as productController } from './productController.js';