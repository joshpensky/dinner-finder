const admin = require('firebase-admin');
const googleStorage = require('@google-cloud/storage');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const storage = googleStorage({
  projectId: serviceAccount.project_id,
  keyFilename: 'server/serviceAccountKey.json'
});
const bucket = storage.bucket(`${serviceAccount.project_id}.appspot.com`);

module.exports = app => {
  const baseUrl = '/api/v1';
  
  require('./users')(app, `${baseUrl}/users`, db);
  require('./restaurants')(app, `${baseUrl}/restaurants`, db, bucket);
  require('./cuisines')(app, `${baseUrl}/cuisines`, db);
};