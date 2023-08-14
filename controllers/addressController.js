const User = require('../models/User');

exports.addAddress = async (req, res) => {
  try {
    const { addline1, addline2, city, pinCode, state } = req.body;
    const userId = req.userData.userId;

    await User.findByIdAndUpdate(userId, {
      addline1,
      addline2,
      city,
      pinCode,
      state
    });

    res.status(200).json({ message: 'Address added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAddress = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = {
      addline1: user.addline1,
      addline2: user.addline2,
      city: user.city,
      pinCode: user.pinCode,
      state: user.state
    };

    res.status(200).json({ address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
