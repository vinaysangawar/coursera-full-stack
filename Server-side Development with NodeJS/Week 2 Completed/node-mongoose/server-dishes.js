const mongoose = require('mongoose');
// const assert = require('assert');
const Dishes = require('./models/dishes');

// Connection URL
const url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected correctly to server');

  Dishes.create(
    {
      name: 'Uthapizza',
      image: 'images/uthapizza.png',
      category: 'mains',
      label: 'Hot',
      price: '4.99',
      description: 'A unique . . .',
      comments: [
        {
          rating: 5,
          comment: 'Imagine all the eatables, living in conFusion!',
          author: 'John Lemon'
        },
        {
          rating: 4,
          comment: 'Sends anyone to heaven, I wish I could get my mother-in-law to eat it!',
          author: 'Paul McVites'
        }
      ]
    },
    (err, dish) => {
      if (err) {
        throw err;
      }

      console.log('Dish created!');
      console.log(dish);
      const id = dish._id;

      // get all the dishes
      setTimeout(() => {
        Dishes.findByIdAndUpdate(
          id,
          {
            $set: {
              description: 'Updated Test'
            }
          },
          {
            new: true
          }
        ).exec((err, dish) => {
          if (err) {
            throw err;
          }
          console.log('Updated Dish!');
          console.log(dish);

          dish.comments.push({
            rating: 5,
            comment: 'Im getting a sinking feeling',
            author: 'Leonardo di Capprio'
          });

          dish.save((err, dish) => {
            console.log('Updated Comments!');
            console.log(dish);

            db.collection('dishes').drop(() => {
              db.close();
            });
          });
        });
      }, 3000);
    }
  );
});
