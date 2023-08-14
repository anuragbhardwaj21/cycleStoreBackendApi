const User = require("../models/User");

exports.addDetails = async (req, res) => {
  try {
    const { dob, gender, phoneNumber } = req.body;
    const userId = req.userData.userId;

    await User.findByIdAndUpdate(userId, {
      dob,
      gender,
      phoneNumber,
    });

    res.status(200).json({ message: "Details added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDetails = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const personalDetails = {
      id: user._id,
      name: user.name,
      dob: user.dob,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
    };

    res.status(200).json({ personalDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
