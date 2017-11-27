const settings = {
  host: 'https://graph.facebook.com',
  version: 'v2.11',
};

module.exports = {
  set: () => {
    if (!process.argv[2] || !process.argv[3]) throw new Error('Missing access token or app secret');
    const accessToken = process.argv[2];
    const appsecret = process.argv[3];
    // if you pass an extra argument in, it will assume you want appsecret_proof

    settings.access_token = accessToken;
    settings.appsecret = appsecret;
  },
  get: () => settings,
};
