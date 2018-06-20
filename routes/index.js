const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const { User } = require('../serializers');

const initMiddleware = app => {
  const users = (req, res, next) => {
    if (app.locals.users) return next();
    db.collection('users').get()
      .then(snapshot => {
        app.locals.users = {};
        snapshot.forEach(doc => {
          const user = User.serialize(doc);
          app.locals.users[user.id] = user;
        });
        next();
      })
      .catch(err => {
        console.log("error retrieving users");
        next();
      });
  };

  return [
    users,
  ];
};

module.exports = app => {
  const baseUrl = '/api/v1';
  const middleware = initMiddleware(app);
  
  require('./users')(app, `${baseUrl}/users`, db, middleware);
  require('./restaurants')(app, `${baseUrl}/restaurants`, db, middleware);
  require('./cuisines')(app, `${baseUrl}/cuisines`, db, middleware);
};