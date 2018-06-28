const { Restaurant } = require('../models');
const { QueryFilter, uploadFileToStorage } = require('../utils');
const { upload } = require('../middleware');

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

  const createEditRestaurant = (req, res, dbPromise) => {
    const { name, description, user, cover_photo_deleted, cuisines, food_options } = req.body,
          cover_photo = req.file,
          clearPhoto = cover_photo_deleted === 'true';
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
      if (url) {
        data = Object.assign(data, { cover_photo: url });
      } else if (clearPhoto) {
        data = Object.assign(data, { cover_photo: '' });
      }
      dbPromise(data, url || clearPhoto).then(ref => {
        console.log(ref);
        res.send(Object.assign(Object.assign({
          id: ref.id,
        }, data), { user: user }));
      }).catch(err => res.status(400).send(err.message));
    }).catch(err => res.status(400).send(err));
  }

  const deletePhotoPromise = id => {
    return db.collection('restaurants').doc(id).get()
      .then(doc => {
        if (doc.exists) {
          const { cover_photo } = doc.data();
          if (cover_photo && cover_photo.length > 0) {
            const filename = cover_photo.split('/').pop();
            return bucket.file(filename).delete()
              .catch(err => Promise.resolve())
          }
        }
        return Promise.resolve()
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
    createEditRestaurant(req, res, data => {
      return db.collection('restaurants').add(data)
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
          var restaurant = Restaurant.serialize(app, doc);
          res.send(restaurant);
        }
      })
      .catch(err => {
        res.status(500).send("Error retrieving restaurant.");
        console.error(err);
      });
  });

  // MARK: - UPDATE restaurant
  app.put(`${uri}/:restaurantId`, upload.single('cover_photo'), (req, res) => {
    const { restaurantId } = req.params;
    createEditRestaurant(req, res, (data, clearPhoto) => {
      return (clearPhoto ? deletePhotoPromise(restaurantId) : Promise.resolve())
        .then(() => db.collection('restaurants').doc(restaurantId).set(data, {
          merge: true,
        }))
        .then(() => ({
          id: restaurantId,
        }));
    });
  });

  // MARK: - DELETE restaurant
  app.delete(`${uri}/:restaurantId`, (req, res) => {
    const { restaurantId } = req.params;
    deletePhotoPromise(restaurantId)
      .then(() => db.collection('restaurants').doc(restaurantId).delete())
      .then(() => res.sendStatus(204))
      .catch(err => {
        res.status(500).send("Error deleting document");
      })
  });
};