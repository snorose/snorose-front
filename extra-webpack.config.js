const { EnvironmentPlugin } = require('webpack');

require('dotenv').config();

module.exports = {
  output: {
    crossOriginLoading: 'anonymous'
  },
  plugins: [
    new EnvironmentPlugin([
      'API_URL'
    ])
  ]
}