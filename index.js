const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// Make App
const app = express();

// MiddleWare
app.use(cors());
app.use(express.json());

// Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5bvzh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const phoneBookCollection = client.db("phone-book").collection("all-contact");

        // Post Api
        app.post('/add-contact', async (req, res) => {
            const contact = req.body;
            const result = await phoneBookCollection.insertOne(contact);
            res.send(result);
        });

        // Get Api
        app.get('/all-contact', async (req, res) => {
            const result = await phoneBookCollection.find().toArray();
            res.send(result);
        });

        // Delete Api
        app.delete('/delete-contact/:id', async (req, res) => {
            const { id } = req.params;
            const result = await phoneBookCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        });
    }
    finally { }
}
run().catch(console.dir);

// Test Api
app.get('/', (req, res) => {
    res.send('Running Phone Book server');
});

// Listen App
app.listen(port, () => {
    console.log('Running server on', port);
});