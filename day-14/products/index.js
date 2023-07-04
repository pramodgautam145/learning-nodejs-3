const express = require("express");
const axios = require("axios").default;
const { randomBytes } = require("crypto");
const amqp = require("amqplib");
const Product = require("./models/product.model");
const mongoose = require("mongoose");
const isAuthenticated = require("pubauthmiddleware");

var channel, connection;

const app = express();
mongoose.connect(
  "mongodb://127.0.0.1:27017/productsdb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`Product-Service DB Connected`);
  },
);

app.use(express.json());

// routes for products
// get all products
app.get("/products", (req, res) => {
  res.json(Product.find({}));
});
// Connect to RabbitMQ
async function connectToRabbitMQ() {
  const amqpServer = "amqp://127.0.0.1";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("product-created-queue");
}
connectToRabbitMQ();
// adding a new product
app.post("/product/create", isAuthenticated, (req, res) => {
  // check for authentication
  const id = randomBytes(4).toString("hex");
  const { title, price, likes, rating, imageUrl } = req.body;

  // save product to db
  const newProduct = new Product({ id, title, price, rating, likes, imageUrl });
  newProduct.save();
  // notify event bus
  channel.sendToQueue(
    "product-created-queue",
    Buffer.from(JSON.stringify({ newProduct })),
  );
  res.status(201).send(newProduct);
});

app.listen(4000, () => {
  console.log(`Products Service running at port 4000 !`);
});
