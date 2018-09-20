const getObjectInsights = require('./getObjectInsights');

module.exports = posts => (
  new Promise(async(resolve, reject) => {
    try {
      console.log(`Getting insights for ${posts.length} posts`);

      const promises = [];
      posts.forEach((post) => {
        const insight = getObjectInsights(post);
        promises.push(insight);
      });

      const insights = await Promise.all(promises);

      const postsWithInsights = posts.map((row, i) => {
        const data = row;
        const insight = insights[i];
        if (insight && insight.data && insight.data[0]) {
          data.reactions = insight.data[0].values[0].value;
          data.engagedUsers = insight.data[1].values[0].value;
          data.engagedFans = insight.data[2].values[0].value;
          delete data.access_token;
        } else if (insight instanceof Error) {
          data.error = insight.message;
        } else {
          data.error = 'Unknown Error';
        }
        return data;
      });

      resolve(JSON.stringify(postsWithInsights));
    } catch (e) {
      reject(e);
    }
  })
);
