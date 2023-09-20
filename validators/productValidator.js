import Joi from 'joi';

const productSchema = Joi.object({                                        // postman form data validation
    name: Joi.string().required(),
    price: Joi.number().required(),
    size: Joi.string().required(),
    image: Joi.string()
});

export default productSchema;
