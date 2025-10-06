// validations/productVendor.validation.js
import Joi from "joi";
import { objectId } from "./common.validation.js"; // helper for ObjectId

export const getProductVendorsSchema = Joi.object({
  productId: objectId.required(),
});
