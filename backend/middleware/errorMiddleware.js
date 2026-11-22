// Please note that ajv and ajv-errors need to be installed separately, as they are not bundled with resolvers
/**
 * @description Generates an error object with a message indicating that a requested
 * URL was not found, sets the HTTP status to 404, and passes the error object to the
 * next middleware function in the request chain.
 * 
 * @param {Request} req - Used to represent the HTTP request.
 * 
 * @param {http.Response} res - Used to send HTTP responses.
 * 
 * @param {Error | undefined} next - Passed to the next middleware or error handler
 * in the stack.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * @description Catches and handles errors by setting a custom HTTP status code and
 * returning a JSON response with an error message and optional stack trace, depending
 * on the production environment.
 * 
 * @param {Error} err - Used to capture any error that might occur during application
 * execution.
 * 
 * @param {http.IncomingMessage} req - Used to represent the HTTP request received
 * by the server.
 * 
 * @param {Response} res - Used to handle HTTP responses.
 * 
 * @param {Function} next - Ignored in this implementation.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
module.exports = { notFound, errorHandler };
