const response = (statusCode, data, message, res) => {
  res.status(statusCode).json({
    status_code: statusCode,
    message,
    data,
  });
};

module.exports = response;
