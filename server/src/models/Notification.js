const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["reminder", "expired", "follow_up"],
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  channel: {
    type: String,
    enum: ["email", "in_app"],
    default: "email",
  },
  daysLeft: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
});

notificationSchema.index({ itemId: 1, daysLeft: 1, type: 1 }, { unique: true });
notificationSchema.index({ userId: 1, sentAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
