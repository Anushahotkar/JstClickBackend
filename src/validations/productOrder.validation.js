import Joi from "joi";

export const getOrdersSchema = Joi.object({
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  status: Joi.string()
    .valid("Upcoming", "Out for Delivery", "Delivered", "Cancelled", "Not Delivered")
    .optional(),
});
