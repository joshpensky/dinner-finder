module.exports = (app, uri, db) => {
  // MARK: - GET cuisine list
  app.get(uri, (req, res) => {
    let restaurantsRef = db.collection('restaurants');
    restaurantsRef.get()
      .then(snapshot => {
        let cuisines = new Set();
        snapshot.forEach(doc => {
          Object.keys(doc.data().cuisines).map(c => cuisines.add(c))
        });
        res.send(Array.from(cuisines).sort());
      })
      .catch(err => {
        res.status(500).send("Error retrieving cuisines.");
        console.log(err);
      });
  });
};