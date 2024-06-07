const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;


//middleware

app.use(cors())
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dcocwar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //await client.connect();

        const userCollection = client.db('dreamspace').collection('users')
        const productCollection = client.db('dreamspace').collection('products')
        const cartCollection = client.db('dreamspace').collection('cart')
        const orderCollection = client.db('dreamspace').collection('orders')


        //USER COLLECTION;

        // Save user email and role in DB
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            const query = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await userCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })

        // Get user
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result)
        })

        // Get single user
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email: email}
            const result = await userCollection.findOne(query);
            res.send(result)
        })

        //PRODUCT COLLECTION;

        //save products to db;


        app.post('/products', async (req, res) => {
            const productData = req.body;
            const result = await productCollection.insertOne(productData);
            res.send(result)
        })

        //get product from db;

        app.get('/products', async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result)
        })

        //get product by email from db;

        app.get('/products', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await productCollection.find(query).toArray();
            res.send(result)
        })

        // get product by id from db to view only;

        app.get('/products/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        // get product by category from db to view only;

        app.get('/products/category/:category', async (req, res) => {
            const productCategory = req.params.category;
            const query = { category: productCategory };
            const result = await productCollection.find(query).toArray();
            res.send(result)
        })

        //update product to db;

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedProductData = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: updatedProductData
            }
            const result = await productCollection.updateOne(query, updateDoc, options)
            res.send(result)

        })

        //delete product from db;

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })


        // CART COLLECTION;

        // save cart item to the db;

        app.post('/carts', async (req, res) => {
            const cartData = req.body;
            const result = await cartCollection.insertOne(cartData);
            res.send(result)
        })

        //get cart item from db;

        app.get('/carts', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await cartCollection.find(query).toArray();
            res.send(result)
        })

        //delete cart item from db;

        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })

        // save order item to db;

        app.post('/orders', async (req, res) => {
            const orderData = req.body;
            const result = await orderCollection.insertOne(orderData);
            res.send(result)
        })

        //get product from db;

        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await orderCollection.find(query).toArray();
            res.send(result)
        })


        //delete order item from db;

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Your Server is running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})