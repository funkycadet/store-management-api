import Joi from "joi";

export const updateUserSchema = Joi.object({
  role: Joi.string().valid("user", "admin").required(),
})

export const idSchema = Joi.object({
  id: Joi.string()
    .regex(/^[a-f\d]{24}$/i) // Regular expression for 24-character hexadecimal strings
    .required()
    .messages({
      'string.pattern.base': 'Invalid MongoDB ObjectId',
    }),
});
