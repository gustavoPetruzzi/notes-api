const handleError = (res, error) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  return res.status(status).json({
    message: message,
    data: data
  });
}

module.exports = handleError;
