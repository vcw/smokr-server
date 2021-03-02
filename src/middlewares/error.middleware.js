function errorMiddleware(error, req, res, next) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  res.status(status);
  res.send({
    status,
    message
  });
}

module.exports = errorMiddleware;