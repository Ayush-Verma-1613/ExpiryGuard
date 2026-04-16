const Notification = require("../models/Notification");

// GET /api/notifications
const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [notifications, total] = await Promise.all([
      Notification.find({ userId: req.user._id })
        .sort({ sentAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("itemId", "name expiryDate"),
      Notification.countDocuments({ userId: req.user._id }),
    ]);

    res.json({
      notifications,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications };
