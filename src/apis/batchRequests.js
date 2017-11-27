const fs = require('fs');
const req = require('../req');
const readline = require('readline');

const getPages = (dataArg, batchSize) => (
  new Promise((resolve) => {
    process.stdout.write('Working');
    const data = dataArg;
    let index = 0;
    let success = 0;
    let error = 0;
    let done = 0;

    const run = async (i) => {
      index++;
      try {
        const { res } = await req({ baseUrl: data[i].link, timeout: 10000, uri: '/', json: false, noToken: true});
        if (res && res.request && res.request.uri && res.request.uri.pathname && res.request.uri.host) {
          success++;
          data[i].host = res.request.uri.host;
          data[i].pathname = res.request.uri.pathname;
        } else {
          error++;
          fs.appendFileSync('./suberrors.log', `${new Date()}, ${JSON.stringify(res)} \n`);
        }
      } catch (e) {
        error++;
        if (e && e.message) {
          fs.appendFileSync('./errors.log', `${new Date()}, ${e.message} \n`);
        }
      }
      done++;
      
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`Started: ${index}, Finsihed: ${success}, Errors: ${error}, Total: ${data.length}, Remaining: ${data.length - success - error}`);

      if (done >= data.length) {
        process.stdout.write('\n');
        resolve(data);
      } else if (index < data.length) {
        run(index);
      }
    };

    for (let i = 0 ; i <= batchSize ; i++) {
      run(index);
    }
  })
);

module.exports = (dataArg, batchSize) => (
  new Promise(async(resolve) => {
    const postsWithWebsite = await getPages(dataArg, batchSize);
    
    const postsClean = postsWithWebsite.filter((row) => {
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
  })
);