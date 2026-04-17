function notFound(req, res, next) {
  //console.log('Not found');
  
  res.status(404).json({
    error: 'Not found',
    message: 'Not found'
  })
}

module.exports = notFound;