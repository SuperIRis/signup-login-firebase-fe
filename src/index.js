//import http from 'http';
import fs from 'fs';
import https from 'https';

const options = {
  key: fs.readFileSync('./ssl2/localhost+2-key.pem'),
  cert: fs.readFileSync('./ssl2/localhost+2.pem'),
};

let app = require('./server').default;

const server = https.createServer(process.env.NODE_ENV === 'development' ? options : {}, app);

let currentApp = app;

server.listen(process.env.PORT || 3000, (error) => {
  if (error) {
    console.log(error);
  }

  console.log('🚀 started');
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      app = require('./server').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}
