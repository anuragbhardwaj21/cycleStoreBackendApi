const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authController = require('./controllers/authController');
const productController = require('./controllers/productController')
const addressController = require('./controllers/addressController')
const personalDataController = require('./controllers/personalDataController')
const authMiddleware = require('./utils/auth');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
var corsOptions = {
  origin: "*",
};

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    `mongodb+srv://anurag2361:anuraggg@anurag2361.1pepyj9.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.post("/signup", authController.signup);
app.post("/login", authController.login);

app.get("/getallproducts", productController.getallproducts);
app.get("/product/:id", productController.getproduct);

app.get("/wishlist",authMiddleware, productController.getWishlist);
app.post("/wishlist/add",authMiddleware ,productController.addToWishlist);
app.post("/wishlist/remove",authMiddleware ,productController.removeFromWishlist);

app.get("/cart",authMiddleware, productController.getCart);
app.post("/cart/add",authMiddleware ,productController.addToCart);
app.post("/cart/remove",authMiddleware ,productController.removeFromCart);

app.post("/addaddress",authMiddleware ,addressController.addAddress);
app.get("/getaddress",authMiddleware, addressController.getAddress);

app.post("/adddetails",authMiddleware ,personalDataController.addDetails);
app.get("/getdetails",authMiddleware, personalDataController.getDetails);

app.listen(PORT);
