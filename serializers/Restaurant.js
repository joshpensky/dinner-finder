class Restaurant {
  static serialize(doc) {
    const data = doc.data()
    return {
      id: doc.id,
      name: data.name,
      user: `${data.user._referencePath.segments.slice(-1)[0]}`,
      cuisines: Object.keys(data.cuisines),
      food_options: data.food_options,
    };
  }
}

module.exports = Restaurant;