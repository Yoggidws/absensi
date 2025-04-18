/**
 * Custom error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Log error for debugging
    console.error(`Error: ${err.message}`);
    console.error(err.stack);
    
    res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
      error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message
    });
  };
  
  /**
   * Async handler to avoid try/catch blocks in route handlers
   */
  const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
  
  module.exports = { errorHandler, asyncHandler };