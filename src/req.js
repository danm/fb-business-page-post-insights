const CryptoJS = require('crypto-js');
const request = require('request');
const settings = require('./settings').get();

module.exports = params => (
  new Promise((resolve, reject) => {
    // grab global request settings
    const defaultParams = {
      baseUrl: `${settings.host}/${settings.version}`,
      json: true,
      method: 'GET',
    };

    // merge and overwrite params
    const opts = Object.assign(defaultParams, params);
    // add access token

    if (!opts.noToken && opts.qs && !opts.qs.access_token) {
      opts.qs.access_token = settings.access_token;
    } else if (!opts.noToken && !opts.qs && !opts.qs) {
      opts.qs = {
        access_token: settings.access_token,
      };
    }

    if (settings.appsecret && opts.qs && opts.qs.access_token) {
      const appsecretProof = CryptoJS.HmacSHA256(opts.qs.access_token, settings.appsecret).toString(CryptoJS.enc.Hex);
      opts.qs.appsecret_proof = appsecretProof;
    }

    // should the promise be rejected which will kill a Promise.all
    // or resolve the promise but pass an Error object.
    if (opts && opts.continueOnError) {
      request(opts, (err, res, body) => {
        if (err) {
          resolve(err);
          return;
        } else if (res.statusCode >= 400 && res.statusCode < 600) {
          if (body && body.error && body.error.message) {
            resolve(new Error(body.error.message));
            return;
          }
          resolve(err);
          return;
        }
        resolve({res, body});
      });
    } else {
      request(opts, (err, res, body) => {
        if (err) {
          reject(err);
          return;
        } else if (res.statusCode >= 400 && res.statusCode < 600) {
          if (body && body.error && body.error.message) {
            reject(new Error(body.error.message));
            return;
          }
          reject(err);
          return;
        }
        resolve({res, body});
      });
    }
  })
);

