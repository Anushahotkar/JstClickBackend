import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as cartService from "../services/cart.service.js";
import { validate } from "../middlewares/validate.js";
import { addToCartSchema, removeFromCartSchema,checkoutCartSchema } from "../validations/cart.validation.js";

export const getCartController = asyncHandler(async (req, res) => {
  const cart = await cartService.getCartService(req.user._id);
  res.json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

export const addItemToCartController = [
  validate(addToCartSchema, "body"),
  asyncHandler(async (req, res) => {
    const { productId, quantity } = req.validatedBody;
    const cart = await cartService.addItemToCartService(req.user._id, productId, quantity);
    res.json(new ApiResponse(200, cart, "Item added to cart successfully"));
  }),
];

export const removeItemFromCartController = [
  validate(removeFromCartSchema, "body"),
  asyncHandler(async (req, res) => {
    const { productId } = req.validatedBody;
    const cart = await cartService.removeItemFromCartService(req.user._id, productId);
    res.json(new ApiResponse(200, cart, "Item removed from cart successfully"));
  }),
];

export const checkoutCartController =[
   validate(checkoutCartSchema, "body"),
   asyncHandler(async (req, res) => {
  const orders = await cartService.checkoutCartService(req.user._id);
  res.json(new ApiResponse(200, orders, "Checkout successful, orders created"));
}),
]
 
