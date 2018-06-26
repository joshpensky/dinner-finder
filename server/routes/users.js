const { Restaurant, User } = require('../models');

const EXPIRE_CACHE = 60 * 60 * 1000;

module.exports = (app, uri, db) => {
  // MARK - User middleware
  app.use((req, res, next) => {
    if (app.locals.users) return next();
    db.collection('users').get()
      .then(snapshot => {
        app.locals.users = {}
        var picturePromises = [];
        snapshot.forEach(doc => {
          app.locals.users[doc.id] = User.serialize(doc);
        });
        setTimeout(() => {
          delete app.locals.users;
        }, EXPIRE_CACHE);
        return next();
      })
      .catch(err => {
        res.status(500).send("Error retrieving users");
        console.error(err);
      });
  })

  // MARK: - GET user list
  app.get(uri, (req, res) => {
    res.send(Object.values(app.locals.users));
  });

  // MARK: - GET user detail
  app.get(`${uri}/:userId`, (req, res) => {
    const userRef = db.collection('users').doc(req.params.userId)
    userRef.get()
      .then(doc => {
        if (!doc.exists) {
          res.status(404).send('User not found');
        } else {
          const user = User.serialize(doc);
          db.collection('restaurants').where('user', '==', userRef).get()
            .then(snapshot => {
              let restaurants = {}
              snapshot.forEach(doc => {
                var { user, ...restaurant } = Restaurant.serialize(app, doc);
                restaurants[restaurant.id] = restaurant;
              });
              res.send(Object.assign(Object.assign({}, user), {
                restaurants: Object.values(restaurants).sort((l, r) => l.name.localeCompare(r.name)),
              }));
            })
            .catch(_ => {
              res.send(Object.assign(Object.assign({}, user), {
                restaurants: [],
              }));
            })
        }
      })
      .catch(err => {
        res.status(500).send("Error retrieving user");
        console.error(err);
      })
  });
};