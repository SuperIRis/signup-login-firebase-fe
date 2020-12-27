import App from './components/App';
import React from 'react';
import express from 'express';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import configureStore from './common/configureStore';
import serialize from 'serialize-javascript';
import auth from './models/auth';
import { getProviderEnvVars, setup as middlewareSetup } from './middleware/setup';
import cookieParser from 'cookie-parser';
import session from 'express-session';
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const providerConfig = getProviderEnvVars();
//mockSession for authorizing user
//truthy value for mock authorized user
//'error' for unauthorized user
//falsey value for real API calls
const mockSession = process.env.NODE_ENV === 'development' && '';
middlewareSetup(); //provider, not express middleware
const server = express();
server.use(
  session({
    secret: '20b11n17-MKRK-4str',
    resave: true,
    saveUninitialized: true,
  })
);
server.use(cookieParser());
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    //we are looking for the httpOnly cookie set in the BE after login
    //the cookie is named "chomp" and contains the firebaseAuth idToken
    auth
      .checkIfUserIsAuthenticated(req.cookies.chomp, mockSession)
      .then((data) => {
        //user authenticated
        const preloadedState = { ...data.data, loggedState: !!data.data.currentUser, sending: false };
        console.log('currentUser state', preloadedState);
        createPage(req, res, preloadedState);
      })
      .catch((error) => {
        //not authenticated
        //console.log('Not auth user', error);
        const preloadedState = { loggedState: false, sending: false };
        createPage(req, res, preloadedState);
      });
  });

const createPage = (req, res, preloadedState) => {
  const store = configureStore(preloadedState);
  const finalState = store.getState();
  const context = {};
  const markup = renderToString(
    <StaticRouter context={context} location={req.url}>
      <Provider store={store}>
        <App />
      </Provider>
    </StaticRouter>
  );

  if (context.url) {
    res.redirect(context.url);
  } else {
    res.status(200).send(
      `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Giftlist</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="//fonts.googleapis.com/css?family=Roboto:300,400,700&display=swap" rel="stylesheet">
        ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </head>
    <body>
        <div id="root">${markup}</div>
        <script>
          window.__PRELOADED_STATE__ = ${serialize(finalState)};
          window.__PROVIDER_CONFIG__ = ${serialize(providerConfig)};
        </script>
    </body>
    
</html>`
    );
  }
};
export default server;
