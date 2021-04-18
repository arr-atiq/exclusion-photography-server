const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const app = express()
const port = process.env.PORT || 8000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.skqkk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
})




client.connect(err => {
    const PhotographyCollection = client.db("exclusionsPhotography").collection("photography");
    const ReviewCollection = client.db("exclusionsPhotography").collection("placeReview");
    const PhotographerCollection = client.db("exclusionsPhotography").collection("photographerCollection");
    const OrderCollection = client.db("exclusionsPhotography").collection("placeOrder");

    app.get('/allServices', (req, res) => {
        PhotographyCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.post('/addService', (req, res) => {
        const newService = req.body;
        PhotographyCollection.insertOne(newService)
            .then(result => {
                console.log(result);
                res.redirect('/')
            })
    })


    app.get('/allReviews', (req, res) => {
        ReviewCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        ReviewCollection.insertOne(newReview)
            .then(result => {
                console.log(result);
                res.redirect('/')
            })
    })

    app.post('/makeAdmin', (req, res) => {
        const newReview = req.body;
        PhotographerCollection.insertOne(newReview)
            .then(result => {
                console.log(result);
                res.redirect('/')
            })
    })

    app.get('/photographers', (req, res) => {
        PhotographerCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.post('/isPhotographer', (req, res) => {
        const email = req.body.email;
        PhotographerCollection.find({ email: email })
            .toArray((err, result) => {
                res.send(result.length > 0);
            })
    })

    app.get('/ServiceProduct/:id', (req, res) => {
        PhotographyCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, items) => {
          res.send(items[0]);
        })
      })

      app.post('/orderPlace', (req, res) =>{
        const newOrder = req.body;
        OrderCollection.insertOne(newOrder)
        .then(result => {
          res.redirect('/')
        })
      })
      app.get('/allPlaceOrders', (req, res) => {
        OrderCollection.find()
        .toArray((err, items) => {
          res.send(items)
        })
      })

});


app.listen(process.env.PORT || port)