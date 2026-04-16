const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: 50,
    },
    icon: {
      type: String,
      default: "FileText",
    },
    color: {
      type: String,
      default: "#6366f1",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ name: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
