if ((process.env.NODE_ENV === 'production')) {
  module.exports = {
    mongoURI: 'mongodb://vjeko:serval85@ds139722.mlab.com:39722/vidjot-prod'
  };
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  };
}
