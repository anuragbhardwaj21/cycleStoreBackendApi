const products = require("../db.json");
const User = require("../models/User");

exports.getallproducts = (req, res) => {
  res.status(200).json(products);
};

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const wishlistProductIds = user.wishlist;
    const wishlistProducts = wishlistProductIds.map((productId) => {
      return products.find((product) => product.id === productId);
    });

    res.status(200).json({ wishlist: wishlistProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartProductIds = user.cart;
    const cartProducts = cartProductIds.map((productId) => {
      return products.find((product) => product.id === productId);
    });

    res.status(200).json({ cart: cartProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productIds } = req.body;
    const userId = req.userData.userId;

    await User.findByIdAndUpdate(userId, {
      $addToSet: { wishlist: { $each: productIds } },
    });

    res.status(200).json({ message: "Products added to wishlist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productIds } = req.body;
    const userId = req.userData.userId;

    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: { $in: productIds } },
    });

    res.status(200).json({ message: "Products removed from wishlist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productIds } = req.body;
    const userId = req.userData.userId;

    await User.findByIdAndUpdate(userId, {
      $addToSet: { cart: { $each: productIds } },
    });

    res.status(200).json({ message: "Products added to cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productIds } = req.body;
    const userId = req.userData.userId;

    await User.findByIdAndUpdate(userId, {
      $pull: { cart: { $in: productIds } },
    });

    res.status(200).json({ message: "Products removed from cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};