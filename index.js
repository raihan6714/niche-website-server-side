const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
// const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

//middlewere
app.use(cors());
app.use(express.json());





app.get('/', (req, res) => {
    res.send('Moto Bike Sales Server Running')
})

app.listen(port, () => {
    console.log(`Moto Bike Sales Server ${port}`)
})