const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create a schema
const leadershipSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    designation: {
      type: String,
      required: true
    },
    abbr: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// the schema is useless so far
// we need to create a model using it
const Leadership = mongoose.model('Leader', leadershipSchema);

// make this available to our Node application
module.exports = Leadership;
