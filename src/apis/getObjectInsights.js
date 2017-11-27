const req = require('../req');

module.exports = (object) => (
  new Promise(async(resolve) => {
    try {
      const params = {
        uri: `/${object.id}/insights/`,
        qs: {
          access_token: object.access_token,
          metric: 'post_reactions_by_type_total,post_engaged_users,post_engaged_fan',
        },
      };
      
      const { body } = await req(params);
      resolve(body);
    } catch (e) {
      resolve(e);
    }
  })
);
