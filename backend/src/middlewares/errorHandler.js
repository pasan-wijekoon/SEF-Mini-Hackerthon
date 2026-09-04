// Not Found (404) Middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// General Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  // Mongoose schema validation errors -> PRD §11 field-error array shape
  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  // Mongoose bad ObjectId (e.g. malformed :id param)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      errors: [{ field: err.path, message: 'Invalid listing ID' }],
    });
  }

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
