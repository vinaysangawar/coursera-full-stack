const mongoose = require('mongoose');
// const assert = require('assert');
const Promotions = require('./models/promotions');

// Connection URL
const url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected correctly to server');

  Promotions.create(
    {
      name: 'Weekend Grand Buffet',
      image: 'images/buffet.png',
      label: 'New',
      price: '19.99',
      description: 'Featuring . . .'
    },
    (err, promotion) => {
      if (err) {
        throw err;
      }

      console.log('Promotion created!');
      console.log(promotion);
      const id = promotion._id;

      // get all the promotions
      setTimeout(() => {
        Promotions.findByIdAndUpdate(
          id,
          {
            $set: {
              description: 'Updated Test'
            }
          },
          {
            new: true
          }
        ).exec((err, promotion) => {
          if (err) {
            throw err;
          }
          console.log('Updated Promotion!');
          console.log(promotion);

          db.collection('promotions').drop(() => {
            db.close();
          });
        });
      }, 3000);
    }
  );
});
