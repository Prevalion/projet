const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Check for Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // Enhanced error logging
  console.error('Error Details:', {
    message: err.message,
    name: err.name,
    stack: err.stack,
    statusCode,
    path: req.path,
    method: req.method,
    body: req.body ? JSON.stringify(req.body).substring(0, 200) : 'No body',
    headers: req.headers ? JSON.stringify(req.headers).substring(0, 200) : 'No headers'
  });

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

export { notFound, errorHandler };
