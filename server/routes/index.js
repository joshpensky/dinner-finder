const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

module.exports = app => {
  const baseUrl = '/api/v1';
  
  require('./users')(app, `${baseUrl}/users`, db);
  require('./restaurants')(app, `${baseUrl}/restaurants`, db);
  require('./cuisines')(app, `${baseUrl}/cuisines`, db);
};