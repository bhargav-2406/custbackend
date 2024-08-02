const express =require("express");
const app=express();
const { connectToDb, getDb } = require('./db');
const cors = require('cors');
app.use(cors());
app.use(express.json());
const { ObjectId } = require('mongodb');

let db;
connectToDb((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    db = getDb();
    app.listen(3001, () => {
      console.log('App is listening on port 3001');
    });
});

app.get("/vendor/products", async (req, res) => {
    try {
    const products = await db.collection('products').find().toArray();
      res.status(200).json(products);
    } catch (error) {
      console.error("Error retrieving products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/vendor/products/:id", async (req, res) => {
    try {
      const productId = req.params.id;
      
      // Ensure that the ID is a valid ObjectId
      if (!ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
  
      const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json(product);
    } catch (error) {
      console.error("Error retrieving product by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


  app.get("/vendor/services", async (req, res) => {
    try {
      const services = await db.collection('services').find().toArray();
      res.status(200).json(services);
    } catch (error) {
      console.error("Error retrieving services:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Endpoint to get a service by ID
  app.get("/vendor/services/:id", async (req, res) => {
    try {
      const serviceId = req.params.id;
  
      // Ensure that the ID is a valid ObjectId
      if (!ObjectId.isValid(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID" });
      }
  
      const service = await db.collection('services').findOne({ _id: new ObjectId(serviceId) });
  
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
  
      res.status(200).json(service);
    } catch (error) {
      console.error("Error retrieving service by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });