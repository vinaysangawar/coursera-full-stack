const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// create a schema
const favoriteSchema = new Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dishes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish'
    }]
  },
  {
    timestamps: true
  }
);

// the schema is useless so far
// we need to create a model using it
const Favorites = mongoose.model('Favorite', favoriteSchema);

// make this available to our Node application
module.exports = Favorites;
