const QueryFilter = require('../utils/QueryFilter');
const { Restaurant } = require('../serializers');

module.exports = (app, uri, db, middleware) => {
  // MARK: - GET restaurant list
  app.get(uri, middleware, (req, res) => {
    let { users, cuisines } = req.query;
    let dbRefs = [db.collection('restaurants').orderBy("name")];
    [
      new QueryFilter(users, (ref, user) => ref.where('user', '==', db.doc(`users/${user}`))),
      new QueryFilter(cuisines, (ref, cuisine) => ref.where(`cuisines.${cuisine}`, '==', true)),
    ].forEach(queryFilter => dbRefs = queryFilter.applyTo(dbRefs));
    Promise.all(dbRefs.map(ref => ref.get()))
      .then(queries => {
        var restaurants = {}
        queries.forEach(snapshot => {
          snapshot.forEach(doc => {
            var restaurant = Restaurant.serialize(doc);
            restaurants[restaurant.id] = restaurant;
          })
        })
        res.send(Object.values(restaurants));
      })
      .catch(err => {
        res.status(500).send(err.message);
      });
  });

  // MARK: - GET restaurant detail
  app.get(`${uri}/:restaurantId`, middleware, (req, res) => {
    let restaurantsRef = db.collection('restaurants').doc(req.params.restaurantId);
    restaurantsRef.get()
      .then(doc => {
        if (!doc.exists) {
          res.status(404).send('Restaurant not found');
        } else {
          var restaurant = Restaurant.serialize(doc);
          res.send(restaurant);
        }
      })
      .catch(err => {
        res.status(500).send(err.message);
      });
  });
};