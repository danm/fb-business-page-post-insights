const batchRequests = require('./batchRequests');

module.exports = posts => (
  new Promise(async(resolve, reject) => {
    try {
      console.log(`Resolving ${posts.length} post urls`);
      const postsWithMeta = await batchRequests(posts, 50);

      // we only care about bbc news posts at this point
      const postsClean = postsWithMeta.filter((row) => {
        if (
          row.pathname &&
          row.pathname.indexOf('/news/') === 0 &&
          row.host &&
          (row.host.includes('bbc.co.uk') || row.host.includes('bbc.com'))
        ) {
          return true;
        }
        return false;
      });


      resolve(postsClean);
    } catch (e) {
      reject(e);
    }
  })
);
