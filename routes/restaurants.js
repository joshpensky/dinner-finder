const QueryFilter = require('../utils/QueryFilter');

module.exports = (app, uri, db, middleware) => {
  // MARK: - restaurant list
  app.get(uri, middleware, (req, res) => {
    let { users, cuisines } = req.query;
    let dbRefs = [db.collection('restaurants')];
    [
      new QueryFilter(users, (ref, user) => ref.where('user', '==', db.doc(`users/${user}`))),
      new QueryFilter(cuisines, (ref, cuisine) => ref.where(`cuisines.${cuisine}`, '==', true)),
    ].forEach(queryFilter => dbRefs = queryFilter.applyTo(dbRefs));
    Promise.all(dbRefs.map(ref => ref.get()))
      .then(snapshots => {
        var restaurants = {}
        snapshots.forEach(snapshot => {
          snapshot.forEach(doc => {
            var { user, cuisines, ...restDoc } = doc.data();
            restaurants[doc.id] = Object.assign({
              id: doc.id,
              user: `${user._referencePath.segments.slice(-1)[0]}`,
              cuisines: Object.keys(cuisines),
            }, restDoc);
          })
        })
        res.send(Object.values(restaurants));
      })
      .catch(err => {
        res.status(500).send(err.message);
      });
  });

  // MARK: - restaurant detail
  app.get(`${uri}/:restaurantId`, middleware, (req, res) => {
    let restaurantsRef = db.collection('restaurants').doc(req.params.restaurantId);
    restaurantsRef.get()
      .then(doc => {
        if (!doc.exists) {
          res.status(404).send('Restaurant does not exist');
        } else {
          const { user, cuisines, ...restDoc } = doc.data()
          res.send(Object.assign({
            id: doc.id,
            user: `${user._referencePath.segments.slice(-1)[0]}`,
            cuisines: Object.keys(cuisines),
          }, restDoc));
        }
      })
      .catch(err => {
        res.status(500).send(err.message);
      });
  });
};