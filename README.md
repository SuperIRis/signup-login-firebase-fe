Base app with signup and login functionalities. Facebook login is integrated, and with it is pretty simple to add other social logins.

Built with [Razzle](https://github.com/jaredpalmer/razzle), [React](https://reactjs.org), [Redux](https://redux.js.org), [Redux saga](https://redux-saga.js.org).

Styled with [CSS Modules](https://github.com/css-modules/css-modules).


**Test mode**
All test modes are restricted to development mode (via process.env.NODE_ENV).

Some components have a test mode to make things faster, like prefill all fields or mock calls to server.

To make mock calls, an extra parameter can be sent from component, in an extra parameter for the actions dispatch. If this parameter exists, a mock service will be called which will always return a success. If the parameter exists and has the value 'error', a mock service will be called which always returns an error (same format as real API, with message).

Example:
``` dispatch(loginRequest({ fbid: Facebook.user.id }, 'error'));``` 


## Migrating
The first version of this project is meant to be deployed in [Firebase](https://firebase.google.com/). 

The app setup consists in a CI/CD from GitLab that deploys the project to Firebase. These are the settings that would need to be configured in GitLab.

###Gitlab CI/CD
To get the API key, we run firebase ```firebase login:ci```
Go to the project in GitLab and go to Settings -> CI/CD -> Variables
Add a variable named FIREBASE_TOKEN, with the generated token
Make it both protected and masked, so it will only be exposed to protected branches and if it’s accidentally echoed to the job output, GitLab will hide it from leaking into there.

###Repo files related to Firebase
- /.firebaserc
- /firebase.json
- /middleware/firebaseConfig.staging
- /middleware/firebaseConfig.production 

###Env variables
In Firebase, to use env variables you need to define them on the CLI.
1. Check all your projects with ```firebase projects:list```
2. Select the project you are going to use with ```firebase use PROJECT_ID```
3. Set variables ```firebase functions:config:set someservice.key="THE API KEY" someservice.id="THE CLIENT ID"```
4. Deploy the configuration with ```firebase deploy --only functions``` or a general deployment (slower)
5. To see the variables you can use ```firebase functions:config:get```

The variables you need to set for the project to work (note, these are not secret keys, please avoid storing secret keys in env files or providers env vars) are defined in .env.example
