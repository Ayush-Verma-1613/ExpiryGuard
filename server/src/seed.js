require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");

const defaultCategories = [
  { name: "Passport", icon: "BookOpen", color: "#3b82f6", isDefault: true },
  { name: "Driver's License", icon: "Car", color: "#8b5cf6", isDefault: true },
  { name: "Insurance", icon: "Shield", color: "#10b981", isDefault: true },
  { name: "Warranty", icon: "BadgeCheck", color: "#f59e0b", isDefault: true },
  { name: "Subscription", icon: "CreditCard", color: "#ec4899", isDefault: true },
  { name: "Certification", icon: "Award", color: "#06b6d4", isDefault: true },
  { name: "Domain Name", icon: "Globe", color: "#f97316", isDefault: true },
  { name: "Other", icon: "FileText", color: "#6b7280", isDefault: true },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const cat of defaultCategories) {
      await Category.findOneAndUpdate(
        { name: cat.name, isDefault: true },
        cat,
        { upsert: true, new: true }
      );
    }

    console.log("Default categories seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
