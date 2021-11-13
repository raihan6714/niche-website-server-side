const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

//middlewere
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.copcb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("motoBike");
        const bikeCollection = database.collection("bikes");
        const ordersCollection = database.collection("orders");
        const usersCollection = database.collection("users");
        const reviewCollectionc = database.collection("reviews");

        //add bikeCollection
        app.post("/addBike", async (req, res) => {
            console.log(req.body);
            const result = await bikeCollection.insertOne(req.body);
            res.send(result);
        });

        // get all bikes
        app.get("/allBikes", async (req, res) => {
            const result = await bikeCollection.find({}).toArray();
            // console.log(result);
            res.send(result);
        });

        // single bike
        app.get("/singleBike/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await bikeCollection
                .find({ _id: ObjectId(req.params.id) })
                .toArray();
            res.send(result[0]);
            // console.log(result);
        });

        //DELETE bike
        app.delete('/deletebike/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bikeCollection.deleteOne(query);
            res.send(result);
        })

        // add review
        app.post("/addReview", async (req, res) => {
            const result = await reviewCollectionc.insertOne(req.body);
            res.send(result);
        });
        // get all review
        app.get("/allReviews", async (req, res) => {
            const result = await reviewCollectionc.find({}).toArray();
            // console.log(result);
            res.send(result);
        });

        //add user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            // console.log(result);
            res.json(result);
        });

        //make admin
        app.put("/makeAdmin", async (req, res) => {
            const filter = { email: req.body.email };
            const result = await usersCollection.find(filter).toArray();
            if (result) {
                const documents = await usersCollection.updateOne(filter, {
                    $set: { role: "admin" },
                });
                // console.log(documents);
            }
        });

        // check admin or not
        app.get("/checkAdmin/:email", async (req, res) => {
            const result = await usersCollection
                .find({ email: req.params.email })
                .toArray();
            console.log(result);
            res.send(result);
        });

        // insert order
        app.post("/addOrders", async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            res.send(result);
        });
        // all orders
        app.get("/allOrders", async (req, res) => {
            // console.log("hello");
            const result = await ordersCollection.find({}).toArray();
            res.send(result);
        });

        //  my order
        app.get("/myOrder/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await ordersCollection
                .find({ email: req.params.email })
                .toArray();
            res.send(result);
        });

        // status update
        app.put("/statusUpdate/:id", async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            console.log(req.params.id);
            const result = await ordersCollection.updateOne(filter, {
                $set: {
                    status: req.body.status,
                },
            });
            res.send(result);
            // console.log(result);
        });

        //DELETE order
        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Moto Bike Sales Server Running')
})

app.listen(port, () => {
    console.log(`Moto Bike Sales Running Server at ${port}`)
})