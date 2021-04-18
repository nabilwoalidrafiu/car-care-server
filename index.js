const express = require('express')

const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()
app.use(cors());
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/", (req, res) => {
    res.send('hello ')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tktro.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("carCare").collection("service");
  const checkoutCollection = client.db("carCare").collection("checkout");
  const reviewCollection = client.db("carCare").collection("review");
 console.log( err, 'database connected');

 app.get('/service', (req, res)=> {
 serviceCollection.find()
  .toArray((err, items) => {
    res.send(items)
  })
})

app.get('/review', (req, res)=> {
  reviewCollection.find()
   .toArray((err, items) => {
     res.send(items)
    //  console.log(items)
   })
 })

app.post('/addReview', (req, res)=>{
  const newService = req.body;
  // console.log('add new Service', newService);
  reviewCollection.insertOne(newService)
  .then(result=> {
    // console.log('inserted count', serviceCollection, result.insertedCount)
    res.send(result.insertedCount > 0)
  })
})

app.get('/checkout', (req, res) => {
  checkoutCollection.find()
  .toArray((err, items) => {
    res.send(items)
  })
})

app.post('/checkout', (req,res)=>{
  const checkOut = req.body;
  checkoutCollection.insertOne(checkOut)
  .then( result => {
      // console.log(result)
      res.send(result.insertedCount > 0)
  })
  // console.log(checkOut)
  // res.send(checkOut)
})

app.get('/checkout', (req, res) => {
  checkoutCollection.find({email: req.query.email})
  .toArray((err, items) => {
    res.send(items)
  })
})


app.get('/service/:_id',(req, res)=>{
  serviceCollection.find({_id: ObjectId(req.params._id)})
  .toArray((err, items) => {
    res.send(items[0])
  })
})

   app.post('/addService', (req, res)=>{
    const newService = req.body;
    // console.log('add new Service', newService);
    serviceCollection.insertOne(newService)
    .then(result=> {
      // console.log('inserted count', serviceCollection, result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })


 app.delete('/delete/:_id', (req, res)=>{
    // const id = ObjectId(req.params._id);
    serviceCollection.deleteOne({_id: ObjectId(req.params._id)})
    .then(documents => {
      // res.send(!!documents.value)
      // console.log(documents)
      // res.redirect('/')
    })
  })
  
});


app.listen(port)