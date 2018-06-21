const { Restaurant, User } = require('../serializers');

module.exports = (app, uri, db) => {
  // MARK: - GET user list
  app.get(uri, (req, res) => {
    db.collection('users').get()
      .then(snapshot => {
        let users = {}
        snapshot.forEach(doc => users[doc.id] = User.serialize(doc));
        res.send(Object.values(users));
      })
      .catch(err => {
        res.status(500).send("Error retrieving users");
        console.log(err);
      });
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
                var { user, ...restaurant } = Restaurant.serialize(doc);
                restaurants[restaurant.id] = restaurant;
              });
              res.send(Object.assign(Object.assign({}, user), {
                restaurants: Object.values(restaurants),
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
        console.log(err);
      })
  });
};