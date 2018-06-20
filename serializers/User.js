class User {
  static serialize(doc) {
    const data = doc.data()
    return {
      id: doc.id,
      name: data.name,
      location: {
        lat: data.location._latitude,
        long: data.location._longitude,
      },
    };
  }
}

module.exports = User;