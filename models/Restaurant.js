class Restaurant {
  constructor(name, user, cuisines, food_options) {
    let errors = this._verifyName(name, {});
    errors = this._verifyUser(user, errors);
    errors = this._verifyCuisines(cuisines, errors);
    errors = this._verifyFoodOptions(food_options, errors);
    if (Object.keys(errors).length > 0) {
      throw Error(JSON.stringify(errors));
    }
  }

  _verifyName(name, errors) {
    if (typeof name === 'string') {
      this.name = name;
    } else {
      errors['name'] = 'Name must be represented by a string.';
    }
    return errors;
  }

  _verifyUser(user, errors) {
    if (typeof user === 'string') {
      this.user = `users/${user}`;
      this.userId = user;
    } else {
      errors['user'] = 'User must be represented by a string ID.';
    }
    return errors;
  }

  _verifyCuisines(cuisines, errors) {
    if (!Array.isArray(cuisines)) {
      errors['cuisines'] = 'Cuisines must be repesented by an array of strings.';
    } else {
      if (cuisines.length === 0) {
        errors['cuisines'] = 'You must include at least one cuisine type.';
      } else {
        this.cuisines = {};
        let cuisinesErr = {};
        let error = false;
        cuisines.forEach(c => {
          if (typeof c === "string") {
            cuisinesErr[c] = '';
            this.cuisines[c] = true;
          } else {
            error = true;
            cuisinesErr[JSON.stringify(c)] = 'Cuisine must be represented by a string.';
          }
        });
        if (Object.keys(cuisinesErr).length > 0 && error) {
          errors['cuisines'] = cuisinesErr;
        }
      }
    }
    return errors;
  }

  _verifyFoodOptions(food_options, errors) {
    if (food_options === undefined) {
      this.food_options = [];
    } else if (!Array.isArray(food_options)) {
      errors['food_options'] = 'Food options must be represented by an array of strings.';
    } else {
      this.food_options = [];
      if (food_options.length > 0) {
        let foodOptionsErr = {};
        let error = false;
        food_options.forEach(opt => {
          if (typeof opt === "string") {
            foodOptionsErr[opt] = '';
            this.food_options.push(opt);
          } else {
            error = true;
            foodOptionsErr[JSON.stringify(opt)] = 'Food option must be represented by a string.';
          }
        });
        if (Object.keys(foodOptionsErr).length > 0 && error) {
          errors['food_options'] = foodOptionsErr;
        }
      }
    }
    return errors;
  }

  data(db) {
    return {
      name: this.name,
      user: db.doc(this.user),
      cuisines: this.cuisines,
      food_options: this.food_options,
    };
  }
}

module.exports = Restaurant;