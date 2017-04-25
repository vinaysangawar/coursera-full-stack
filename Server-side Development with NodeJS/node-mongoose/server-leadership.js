const mongoose = require('mongoose');
// const assert = require('assert');
const Leadership = require('./models/leadership');

// Connection URL
const url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected correctly to server');

  Leadership.create(
    {
      name: 'Peter Pan',
      image: 'images/alberto.png',
      designation: 'Chief Epicurious Officer',
      abbr: 'CEO',
      description: 'Our CEO, Peter, . . .'
    },
    (err, leader) => {
      if (err) {
        throw err;
      }

      console.log('Leader created!');
      console.log(leader);
      const id = leader._id;

      // get all the leaders
      setTimeout(() => {
        Leadership.findByIdAndUpdate(
          id,
          {
            $set: {
              description: 'Updated Test'
            }
          },
          {
            new: true
          }
        ).exec((err, leader) => {
          if (err) {
            throw err;
          }
          console.log('Updated Leader!');
          console.log(leader);

          db.collection('leaders').drop(() => {
            db.close();
          });
        });
      }, 3000);
    }
  );
});
