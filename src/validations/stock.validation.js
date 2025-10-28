import Joi from "joi";

const getCategoriesSchema = Joi.object({});

const objectId = Joi.string().hex().length(24);


export const getItemsByCategorySchema = Joi.object({
  categoryId: objectId.required(),
  type: Joi.string().valid("product", "service").required(),
});

export const getItemsTypeSchema = Joi.object({
  type: Joi.string().valid("product", "service").default("product"),
});


export {getCategoriesSchema};