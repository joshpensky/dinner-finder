module.exports = (app, uri, db, middleware) => {
  // MARK: - cuisine list
  app.get(uri, middleware, (req, res) => {
    let restaurantsRef = db.collection('restaurants');
    restaurantsRef.get()
      .then(snapshot => {
        let cuisines = new Set();
        snapshot.forEach(doc => {
          Object.keys(doc.data().cuisines).map(c => cuisines.add(c))
        });
        res.send(Array.from(cuisines));
      })
      .catch(err => {
        res.status(500).send(err.message);
      });
  });
};