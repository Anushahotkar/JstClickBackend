// middlewares/validate.js
import { ApiError } from "../utils/ApiError.js";

export const validate = (schema, property = "body") => {
  return (req, res, next) => {
     console.log('req.body BEFORE validation:', req.body); 
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(
        new ApiError(
          400,
          "Validation failed",
          error.details.map(err => ({
            message: err.message,
            path: err.path,
          }))
        )
      );
    }

    // Instead of overwriting req[property], attach validated data to a separate property
    if (property === "query") req.validatedQuery = value;
    else if (property === "body") req.validatedBody = value;
    else req[property] = value;
    
    console.log('req.validatedBody AFTER validation:', req.validatedBody); // <--- add this
    next();
  };
};

