const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5o1cz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 const run = async ()=>{
     try{
      await client.connect();
     const productCollection = client.db('smartHub').collection('product');

     app.post('/products', async (req, res)=>{
         const product = req.body;
         if(!product.name || !product.price){
             return res.send({ success: false, error: " Please provide all  information"})
         }
         const result = await productCollection.insertOne(product);
         res.send({success: true, message: `Successfuly Inserted ${product.name}`})
     })

     app.get('/management', async(req, res)=>{
         const cursor = productCollection.find();
         const products = await cursor.toArray();
     if(!products?.length){
         return res.send({success: false, error: "No data found" })
     }
     res.send({success: true, data: products})
        })
        // delete Api
        app.delete('/management/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);

        })
     }
     catch(error){
     console.log(error);
     }
 }
 run();

app.get('/', (req, res)=>{
    res.send('Running server');
})

app.listen(port, ()=>{
    console.log('Listening to port', port)
})