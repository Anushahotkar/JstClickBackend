import Joi from "joi";
import JoiObjectId from "joi-objectid";

Joi.ObjectId = JoiObjectId(Joi);

export const updateBookedServiceSchema = Joi.object({
  bookingId: Joi.ObjectId().required(),
  status: Joi.string()
    .valid("Upcoming", "Scheduled", "Ongoing", "Completed", "Cancelled")
    .required(),
});
