const req = require('../req');

const getPagePosts = (page) => (
  new Promise(async(resolve, reject) => {
    try {
      const params = {
        uri: `/${page.id}`,
        qs: {
          limit: 100,
          fields: 'feed{created_time,permalink_url,type,link,message,name,object_id,comments.summary(1).limit(0),shares}',
        },
      };
      
      const { body } = await req(params);
      
      if (page && body.feed && body.feed.data) {
        body.feed.data = body.feed.data.map((row) => {
          const data = row;
          data.comments = (row.comments && row.comments.summary && row.comments.summary.total_count) || 0;
          data.shares = (row.shares && row.shares.count) || 0;
          data.name = page.name;
          data.access_token = page.access_token;
          return data;
        });
        resolve(body);
      } else {
        reject(new Error(`No data returned from ${page.id}`));
      }
    } catch (e) {
      reject(e);
    }
  })
);

module.exports = pages => (
  new Promise(async(resolve, reject) => {
    try {
      console.log(`Getting ${pages.length} page feeds`);
      const promises = [];
      // loop through pages getting the feed for them
      pages.forEach((page) => {
        promises.push(getPagePosts(page));
      });

      // wait till all pages have returned
      const allPagePosts = await Promise.all(promises);

      // clean the results and return a simple array
      const posts = allPagePosts.reduce((prev, curr) => (
        prev.concat(curr.feed.data)
      ), []).filter((row) => {
        if (row.type === 'link' && row.link) return true;
        return false;
      });

      resolve(posts);
    } catch (e) {
      reject(e);
    }
  })
);


