const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

const Schema = mongoose.Schema;
const Currency = mongoose.Types.Currency;
const commentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// create a schema
const dishSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    price: {
      type: Currency,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    comments: [commentSchema]
  },
  {
    timestamps: true
  }
);

// the schema is useless so far
// we need to create a model using it
const Dishes = mongoose.model('Dish', dishSchema);

// make this available to our Node application
module.exports = Dishes;
