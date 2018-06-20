module.exports = (app, uri, db, middleware) => {
  // MARK: - users list
  app.get(uri, middleware, (req, res) => {
    res.send(Object.values(app.locals.users));
  });

  // MARK: - user detail
  app.get(`${uri}/:userId`, middleware, (req, res) => {
    const userId = req.params.userId;
    if (app.locals.users[userId]) {
      const restaurantsRef = db.collection('restaurants').where('user', '==', db.doc(`users/${userId}`));
      restaurantsRef.get()
        .then(snapshot => {
          let restaurants = {}
          snapshot.forEach(doc => {
            var { user, ...restDoc } = doc.data();
            restaurants[doc.id] = Object.assign({
              id: doc.id,
            }, restDoc);
          });
          res.send(Object.assign(app.locals.users[userId], {
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