"use strict";

var mongoose = require('mongoose'),
    assert = require('assert');

var Dishes = require('./models/dishes-3');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
    console.log('Connected correctly to server');

    Dishes.create({
        name: 'Uthapizza',
        description: 'Test3',
        comments: [
            {
                rating: 3,
                comment: 'This is insane',
                author: 'Matt Daemon'
            }
        ]
    }, (err, dish)=> {
        if (err) {
            throw err;
        }

        console.log('Dish created!');
        console.log(dish);
        var id = dish._id;

        // get all the dishes
        setTimeout(()=> {
            Dishes.findByIdAndUpdate(id, {
                $set: {
                    description: 'Updated Test'
                }
            }, {
                new: true
            })
                .exec((err, dish)=> {
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

                    dish.save((err, dish)=> {
                        console.log('Updated Comments!');
                        console.log(dish);

                        db.collection('dishes').drop(()=> {
                            db.close();
                        });
                    });
                });
        }, 3000);
    });
});
