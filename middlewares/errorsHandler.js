function errorHandler(err, req, res, next) {
  //console.log('Si è verificato un errore');

  res.status(500).json({
  error: 'error 500',
  message: 'Si è verificato un errore'
})
}

module.exports = errorHandler;