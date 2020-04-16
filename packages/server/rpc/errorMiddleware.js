const isStandalone = process.env.STANDALONE === 'true';

module.exports = (error, req, res, next) => {
  if (isStandalone) {
    // eslint-disable-next-line no-console
    console.error('🚩 RPC Error');
    console.error({
      path: req.path,
      error,
    });
  }
  if (res.headersSent) {
    return next(error);
  }
  res.status(500).send({
    error: error.message,
    code: 5000,
    handled: false,
  });
};
