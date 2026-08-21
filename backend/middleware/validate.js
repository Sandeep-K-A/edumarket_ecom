const ApiError = require("../utils/ApiError");

/**
 validate middleware is used to add the zod validation on req.body,req.params and req.query,
it takes the data from the req object and then validates it using schema and then replace the
parsed data back to req object so that the controller can get cleaner version of req object
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    return next(ApiError.badRequest("Validation failed", details));
  }

  if (result.data.body) req.body = result.data.body;
  if (result.data.params) req.params = result.data.params;
  if (result.data.query) {
    Object.keys(req.query).forEach((k) => delete req.query[k]);
    Object.assign(req.query, result.data.query);
  }

  next();
};

module.exports = validate;
