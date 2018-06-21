const QueryFilter = require('../utils/QueryFilter');
const { Restaurant: RestaurantModel } = require('../models');
const { Restaurant: ResturantSerializer } = require('../serializers');

module.exports = (app, uri, db) => {
  // MARK: - GET restaurant list
  app.get(uri, (req, res) => {
    let { users, cuisines } = req.query;
    let dbRefs = [db.collection('restaurants')];
    [
      new QueryFilter(users, (ref, user) => ref.where('user', '==', db.doc(`users/${user}`))),
      new QueryFilter(cuisines, (ref, cuisine) => ref.where(`cuisines.${cuisine}`, '==', true)),
    ].forEach(queryFilter => dbRefs = queryFilter.applyTo(dbRefs));
    Promise.all(dbRefs.map(ref => ref.get()))
      .then(queries => {
        var restaurants = {}
        queries.forEach(snapshot => {
          snapshot.forEach(doc => {
            var restaurant = ResturantSerializer.serialize(doc);
            restaurants[restaurant.id] = restaurant;
          })
        })
        res.send(Object.values(restaurants)
          .sort((l, r) => l.name.localeCompare(r.name)));
      })
      .catch(err => {
        res.status(500).send("Error retrieving restaurants");
        console.log(err);
      });
  });

  // MARK: - CREATE restaurant
  app.post(uri, (req, res) => {
    const { name, user, cuisines, food_options } = req.body;
    var restaurant;
    try {
      restaurant = new RestaurantModel(name, user, cuisines, food_options);
    } catch (err) {
      return res.status(400).send(JSON.parse(err.message));
    }
    let data = restaurant.data(db);
    var transaction = db.runTransaction(t => {
      return t.get(db.collection('users'))
        .then(snapshot => {
          let userExists = false;
          snapshot.forEach(doc => userExists = userExists || doc.id === restaurant.userId);
          if (userExists) {
            return Promise.resolve();
          }
          return Promise.reject('User does not exist');
        });
    }).then(result => {
      db.collection('restaurants').add(data)
        .then(ref => {
          data.user = user;
          res.send(Object.assign({ id: ref.id, }, data));
        })
        .catch(err => {
          res.status(400).send(err.message);
        });
    }).catch(err => {
      res.status(400).send(err);
    });
  });

  // MARK: - GET restaurant detail
  app.get(`${uri}/:restaurantId`, (req, res) => {
    let restaurantsRef = db.collection('restaurants').doc(req.params.restaurantId);
    restaurantsRef.get()
      .then(doc => {
        if (!doc.exists) {
          res.status(404).send('Restaurant not found');
        } else {
          var restaurant = ResturantSerializer.serialize(doc);
          res.send(restaurant);
        }
      })
      .catch(err => {
        res.status(500).send("Error retrieving restaurant.");
        console.log(err);
      });
  });
};