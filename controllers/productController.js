const products = require("../db.json");
const User = require("../models/User");

exports.getallproducts = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;


  let filteredProducts = [...products];


  if (req.query._sort && req.query._order) {
    const sortingField = req.query._sort;
    const sortOrder = req.query._order === 'asc' ? 1 : -1;
    filteredProducts.sort((a, b) => (a[sortingField] - b[sortingField]) * sortOrder);
  }


  if (req.query.category) {
    const category = req.query.category;
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }


  if (req.query.price_gte && req.query.price_lte) {
    const minPrice = parseInt(req.query.price_gte);
    const maxPrice = parseInt(req.query.price_lte);
    filteredProducts = filteredProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);
  }


  if (req.query.color_like) {
    const color = req.query.color_like;
    filteredProducts = filteredProducts.filter(product => product.color.includes(color));
  }


  if (req.query.id_gte && req.query.id_lte) {
    const minId = parseInt(req.query.id_gte);
    const maxId = parseInt(req.query.id_lte);
    filteredProducts = filteredProducts.filter(product => product.id >= minId && product.id <= maxId);
  }

  const totalCount = filteredProducts.length;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
  res.setHeader("X-Total-Count", totalCount);

  res.status(200).json(paginatedProducts);
};



exports.getproduct = (req, res) => {
  const productId = parseInt(req.params.id);

  const product = products.find((product) => product.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
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
