const fs = require('fs');
const settings = require('./settings');
const getSystemAssignedPages = require('./apis/getSystemAssignedPages');
const getPagePosts = require('./apis/getPagePosts');
const resolveLinkShares = require('./apis/resolveLinkShares');
const getAllPostInsights = require('./apis/getAllPostInsights');

const init = async () => {
  try {
    // set cli arguments 
    settings.set(process.argv[2], process.argv[3]);

    // get all pages that belong to system account
    const pages = await getSystemAssignedPages();

    // get feed of all pages
    const posts = await getPagePosts(pages);
    
    // translate all links in a page post to see if it has linked to the News site articles
    // if a short url is shared (bbc.in) we need to resolve it and return a path
    const postsWhichShareBBCNews = await resolveLinkShares(posts);
    
    // return insights of the pages that we care about
    const data =  await getAllPostInsights(postsWhichShareBBCNews);

    fs.writeFileSync('./output.json.log', JSON.stringify(data));
    console.log('Finsihed, see ./output.json.log for result and ./errors.log for errors');
    
    // we are done, but getAllPostInsights returns insights for the posts it checked.
  } catch (e) {
    console.log(e.message);
    // console.log(e.stack);
  }
};

init();