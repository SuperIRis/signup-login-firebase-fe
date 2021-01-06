export const firebaseConfig = (firebaseEnv) => {
  const apiKey = process.env.RAZZLE_FIREBASE_API_KEY || firebaseEnv.config['api_key'];
  const projectId = process.env.RAZZLE_FIREBASE_PROJECT_ID || firebaseEnv.config['project_id'];
  const projectSuffix = process.env.RAZZLE_FIREBASE_PROJECT_SUFFIX || firebaseEnv.config['project_suffix'];
  const senderId = process.env.RAZZLE_FIREBASE_SENDER_ID || firebaseEnv.config['sender_id'];
  const appId = process.env.RAZZLE_FIREBASE_APP_ID || firebaseEnv.config['app_id'];

  return {
    apiKey: apiKey,
    authDomain: `${projectId}-${projectSuffix}.firebaseapp.com`,
    databaseURL: `https://${projectId}-${projectSuffix}.firebaseio.com`,
    projectId: projectId,
    storageBucket: `${projectId}.appspot.com`,
    messagingSenderId: senderId,
    appId: appId,
  };
};
