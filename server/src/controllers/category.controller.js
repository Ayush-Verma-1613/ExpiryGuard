const Category = require("../models/Category");

// GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({
      $or: [{ isDefault: true }, { userId: req.user._id }],
    }).sort({ isDefault: -1, name: 1 });

    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create({
      ...req.body,
      isDefault: false,
      userId: req.user._id,
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDefault: false,
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found or cannot edit default categories" });
    }

    Object.assign(category, req.body);
    await category.save();

    res.json(category);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDefault: false,
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found or cannot delete default categories" });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
