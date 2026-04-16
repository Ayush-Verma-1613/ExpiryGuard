const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 50,
    },
    relation: {
      type: String,
      required: [true, "Relation is required"],
      enum: ["Self", "Spouse", "Child", "Parent", "Other"],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FamilyMember", familyMemberSchema);
