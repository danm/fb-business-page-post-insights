const settings = require('../settings').get();
const req = require('../req');


// if there are more then 100 pages assosiated with account,
// we can run a secondary function to pull the rest and aggregate them.

const getMore = async (next, pages, resolve, reject) => {
  try {
    const uri = next.replace(`${settings.host}/${settings.version}`, '');
    const { body } = await req({ uri });
    const newPages = pages.concat(body.data);
    if (body.paging && body.paging && body.paging.next) {
      getMore(body.paging.next, newPages, resolve, reject)
    } else {
      resolve(newPages);
    }
  } catch (e) {
    reject(e);
  }
};

module.exports = () => (
  new Promise(async (resolve, reject) => {
    const params = {
      uri: `/me`,
      qs: { 
        fields: `assigned_pages.limit(100){access_token,name,object_id}`,
      },
    };
    try {
      const { body } = await req(params);
      if (body.assigned_pages && body.assigned_pages.paging && body.assigned_pages.paging.next) {
        getMore(body.assigned_pages.paging.next, body.assigned_pages.data, resolve, reject);
      } else {
        resolve(body.assigned_pages.data);
      }
    } catch (e) {
      reject(e);
    }
  })
);
