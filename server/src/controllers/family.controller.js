const FamilyMember = require("../models/FamilyMember");

// GET /api/family
const getMembers = async (req, res, next) => {
  try {
    const members = await FamilyMember.find({ userId: req.user._id }).sort({ relation: 1, name: 1 });
    res.json(members);
  } catch (error) {
    next(error);
  }
};

// POST /api/family
const createMember = async (req, res, next) => {
  try {
    const member = await FamilyMember.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/family/:id
const updateMember = async (req, res, next) => {
  try {
    const member = await FamilyMember.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({ error: "Family member not found" });
    }

    res.json(member);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/family/:id
const deleteMember = async (req, res, next) => {
  try {
    const member = await FamilyMember.findOne({ _id: req.params.id, userId: req.user._id });

    if (!member) {
      return res.status(404).json({ error: "Family member not found" });
    }

    if (member.relation === "Self") {
      return res.status(400).json({ error: "Cannot delete Self member" });
    }

    await member.deleteOne();
    res.json({ message: "Family member deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMembers, createMember, updateMember, deleteMember };
