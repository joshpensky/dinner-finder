const admin = require('firebase-admin');
var serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();

const initMiddleware = app => {
  const usersMiddleware = (req, res, next) => {
    if (app.locals.users) return next();
    db.collection('users').get()
      .then(snapshot => {
        app.locals.users = {};
        snapshot.forEach(doc => {
          app.locals.users[doc.id] = Object.assign({
            id: doc.id,
          }, doc.data());
        });
        next();
      })
      .catch(err => {
        console.log("error retrieving users");
        next();
      });
  };

  return [usersMiddleware];
}

module.exports = app => {
  const baseUrl = '/api/v1';
  const middleware = initMiddleware(app);
  
  require('./users')(app, `${baseUrl}/users`, db, middleware);
  require('./restaurants')(app, `${baseUrl}/restaurants`, db, middleware);
  require('./cuisines')(app, `${baseUrl}/cuisines`, db, middleware);
};