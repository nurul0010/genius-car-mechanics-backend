const { MongoClient } = require('mongodb');
const express = require('express');
require("dotenv").config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('hello from backend')
});

// username =>
// car-mechanism 

// pass=> 
// StSljpkpue2gPEQZ

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hr9du.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        // console.log('connected to db')
        const database = client.db("carMechanics");
        const servicesCollection = database.collection("services");
        // create a document to insert

        // post api ==> 
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('db hitted', service)

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });
        // get api ==> 

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();

            res.send(services);
        });

        // get single one api ==>
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);

            res.json(service);
        });

        // delete single on item api ==> 

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deleteItem = await servicesCollection.deleteOne(query);

            res.json(deleteItem);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('listening from port', port)
});