const { Restaurant } = require('../serializers');

module.exports = (app, uri, db, middleware) => {
  // MARK: - GET user list
  app.get(uri, middleware, (req, res) => {
    res.send(Object.values(app.locals.users));
  });

  // MARK: - GET user detail
  app.get(`${uri}/:userId`, middleware, (req, res) => {
    const { userId } = req.params;
    const user = app.locals.users[userId];
    if (user) {
      const restaurantsRef = db.collection('restaurants').where('user', '==', db.doc(`users/${userId}`));
      restaurantsRef.get()
        .then(snapshot => {
          let restaurants = {}
          snapshot.forEach(doc => {
            var { user, ...restaurant } = Restaurant.serialize(doc);
            restaurants[restaurant.id] = restaurant;
          });
          res.send(Object.assign(Object.assign({}, user), {
            restaurants: Object.values(restaurants),
          }));
        })
        .catch(err => {
          res.status(500).send(err.message);
        });
    } else {
      res.status(404).send('User not found');
    }
  });
};