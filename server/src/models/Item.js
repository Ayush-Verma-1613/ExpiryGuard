const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    purchaseDate: {
      type: Date,
    },
    cost: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "expired", "renewed", "archived"],
      default: "active",
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
    documentUrl: {
      type: String,
    },
    documentPublicId: {
      type: String,
    },
    reminderDays: {
      type: [Number],
      default: [30, 7, 1],
    },
    isEmergency: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    familyMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FamilyMember",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.index({ userId: 1, expiryDate: 1 });
itemSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model("Item", itemSchema);
