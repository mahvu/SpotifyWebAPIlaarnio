const _ = require('lodash');

requireEnvs = (arr) => {
    _.each(arr, varName => {
    if (!process.env[varName]) {
      throw new Error('Environment variable not set: ' + varName);
    }
  });
}

module.exports = requireEnvs;