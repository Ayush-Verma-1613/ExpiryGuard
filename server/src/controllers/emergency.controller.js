const crypto = require("crypto");
const User = require("../models/User");
const Item = require("../models/Item");

// POST /api/emergency-card/generate (authenticated)
const generateCard = async (req, res, next) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");

    await User.findByIdAndUpdate(req.user._id, { emergencyToken: token });

    res.json({
      token,
      url: `${process.env.CLIENT_URL}/emergency/${token}`,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/emergency-card/:token (public)
const getCard = async (req, res, next) => {
  try {
    const user = await User.findOne({ emergencyToken: req.params.token });
    if (!user) {
      return res.status(404).json({ error: "Emergency card not found" });
    }

    const items = await Item.find({
      userId: user._id,
      isEmergency: true,
    })
      .select("name expiryDate categoryId status")
      .populate("categoryId", "name icon color");

    res.json({
      name: user.name,
      items,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateCard, getCard };
