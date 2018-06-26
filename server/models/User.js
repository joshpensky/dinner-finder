class User {
  static serialize(doc) {
    const data = doc.data()
    return {
      id: doc.id,
      name: {
        first: data.name.first,
        last: data.name.last,
      },
      location: {
        lat: data.location._latitude,
        long: data.location._longitude,
      },
      profile_picture: data.profile_picture,
    };
  }
}

module.exports = User;