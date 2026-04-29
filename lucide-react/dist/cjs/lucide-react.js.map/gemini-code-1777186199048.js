module.exports = {
  // Use 'source-map' for dev, but 'false' or 'none' for production
  devtool: process.env.NODE_ENV === 'production' ? false : 'eval-source-map',
};