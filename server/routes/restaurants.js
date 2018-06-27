const QueryFilter = require('../utils/QueryFilter');
const { Restaurant } = require('../models');
const { uploadFileToStorage } = require('../utils');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

module.exports = (app, uri, db, bucket) => {
  // MARK: - Helper function for querying restaurants
  const getFilteredQuery = (req, res) => {
    let { users, cuisines } = req.query;
    let dbRefs = [db.collection('restaurants')];
    [
      new QueryFilter(users, (ref, user) => ref.where('user', '==', db.doc(`users/${user}`))),
      new QueryFilter(cuisines, (ref, cuisine) => ref.where(`cuisines.${cuisine}`, '==', true)),
    ].forEach(queryFilter => dbRefs = queryFilter.applyTo(dbRefs));
    return Promise.all(dbRefs.map(ref => ref.get()))
      .then(queries => {
        var restaurants = {}
        queries.forEach(snapshot => {
          snapshot.forEach(doc => {
            var restaurant = Restaurant.serialize(app, doc);
            restaurants[restaurant.id] = restaurant;
          });
        });
        return Object.values(restaurants).sort((l, r) => l.name.localeCompare(r.name))
      })
      .catch(err => {
        res.status(500).send("Error retrieving restaurants");
        console.error(err);
      });
  }

  // MARK: - GET restaurant list
  app.get(uri, (req, res) => {
    getFilteredQuery(req, res)
      .then(restaurants => res.send(restaurants));
  });

  // MARK: - GET random restaurant
  app.get(`${uri}/choose`, (req, res) => {
    getFilteredQuery(req, res)
      .then(restaurants => {
        res.send(restaurants[Math.floor(Math.random() * restaurants.length)]);
      });
  })

  // MARK: - CREATE restaurant
  app.post(uri, upload.single('cover_photo'), (req, res) => {
    const { name, description, user, cuisines, food_options } = req.body;
    const cover_photo = req.file;
    var restaurant;
    try {
      restaurant = new Restaurant(name, description, cover_photo, user, JSON.parse(cuisines), JSON.parse(food_options));
    } catch (err) {
      console.log(err);
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
    }).then(() => {
        return restaurant.cover_photo
          ? uploadFileToStorage(bucket, restaurant.cover_photo, restaurant.cover_photo_name)
          : Promise.resolve();
    }).then(url => {
      console.log(url)
        if (url) {
          Object.assign(data, {
            cover_photo: url,
          });
        }
        db.collection('restaurants').add(data)
          .then(ref => {
            res.send(Object.assign(Object.assign({
              id: ref.id,
            }, data), { user: user }));
          })
          .catch(err => res.status(400).send(err.message));
    }).catch(err => res.status(400).send(err));
  });

  // MARK: - GET restaurant detail
  app.get(`${uri}/:restaurantId`, (req, res) => {
    let restaurantsRef = db.collection('restaurants').doc(req.params.restaurantId);
    restaurantsRef.get()
      .then(doc => {
        if (!doc.exists) {
          res.status(404).send('Restaurant not found');
        } else {
          var restaurant = Restaurant.serialize(app, doc);
          res.send(restaurant);
        }
      })
      .catch(err => {
        res.status(500).send("Error retrieving restaurant.");
        console.error(err);
      });
  });
};