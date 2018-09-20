const settings = {
  host: 'https://graph.facebook.com',
  version: 'v2.11',
};

module.exports = {
  set: (accessToken, appsecret) => {
    if (!accessToken || !appsecret) throw new Error('Missing access token or app secret');

    settings.access_token = accessToken;
    settings.appsecret = appsecret;
  },
  get: () => settings,
};
