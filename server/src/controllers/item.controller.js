const mongoose = require("mongoose");
const Item = require("../models/Item");
const cloudinary = require("../config/cloudinary");

// Escape regex special characters for safe $regex queries
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/items
const getItems = async (req, res, next) => {
  try {
    const { search, category, status, member, sort, page = 1, limit = 20 } = req.query;

    const filter = { userId: req.user._id };

    if (search && typeof search === "string" && search.trim()) {
      const escaped = escapeRegex(search.trim());
      filter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { description: { $regex: escaped, $options: "i" } },
      ];
    }

    if (category && typeof category === "string" && mongoose.Types.ObjectId.isValid(category)) {
      filter.categoryId = new mongoose.Types.ObjectId(category);
    }

    if (status && typeof status === "string") {
      filter.status = status;
    }

    if (member && typeof member === "string" && mongoose.Types.ObjectId.isValid(member)) {
      filter.familyMemberId = new mongoose.Types.ObjectId(member);
    }

    const sortOptions = {
      expiry_asc: { expiryDate: 1 },
      expiry_desc: { expiryDate: -1 },
      name_asc: { name: 1 },
      name_desc: { name: -1 },
      newest: { createdAt: -1 },
    };
    const sortOption = sortOptions[sort] || { expiryDate: 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Item.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .populate("categoryId", "name icon color")
        .populate("familyMemberId", "name relation"),
      Item.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/items/:id
const getItem = async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, userId: req.user._id })
      .populate("categoryId", "name icon color")
      .populate("familyMemberId", "name relation");

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
};

// POST /api/items
const createItem = async (req, res, next) => {
  try {
    const item = await Item.create({
      ...req.body,
      userId: req.user._id,
    });

    const populated = await item.populate([
      { path: "categoryId", select: "name icon color" },
      { path: "familyMemberId", select: "name relation" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/items/:id
const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    )
      .populate("categoryId", "name icon color")
      .populate("familyMemberId", "name relation");

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/items/:id
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, userId: req.user._id });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Clean up Cloudinary document if exists
    if (item.documentPublicId) {
      try {
        await cloudinary.uploader.destroy(item.documentPublicId);
      } catch (err) {
        console.error("Cloudinary cleanup failed:", err.message);
      }
    }

    await item.deleteOne();
    res.json({ message: "Item deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
