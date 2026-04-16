const mongoose = require("mongoose");
const Item = require("../models/Item");

// GET /api/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const [statusCounts, byCategory, byMonth, byMember] = await Promise.all([
      // Count by status
      Item.aggregate([
        { $match: { userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // Count by category
      Item.aggregate([
        { $match: { userId } },
        { $group: { _id: "$categoryId", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $project: {
            name: "$category.name",
            color: "$category.color",
            count: 1,
          },
        },
      ]),

      // Expirations by month (next 12 months)
      Item.aggregate([
        {
          $match: {
            userId,
            status: "active",
            expiryDate: {
              $gte: new Date(),
              $lte: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$expiryDate" },
              month: { $month: "$expiryDate" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      // Count by family member
      Item.aggregate([
        { $match: { userId, familyMemberId: { $ne: null } } },
        { $group: { _id: "$familyMemberId", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "familymembers",
            localField: "_id",
            foreignField: "_id",
            as: "member",
          },
        },
        { $unwind: "$member" },
        { $project: { name: "$member.name", relation: "$member.relation", count: 1 } },
      ]),
    ]);

    // Build status summary
    const statusMap = {};
    statusCounts.forEach((s) => (statusMap[s._id] = s.count));
    const total = Object.values(statusMap).reduce((a, b) => a + b, 0);

    // Count expiring within 30 days
    const expiringThisMonth = await Item.countDocuments({
      userId: req.user._id,
      status: "active",
      expiryDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      total,
      active: statusMap.active || 0,
      expired: statusMap.expired || 0,
      renewed: statusMap.renewed || 0,
      archived: statusMap.archived || 0,
      expiringThisMonth,
      byCategory,
      byMonth: byMonth.map((m) => ({
        month: `${m._id.year}-${String(m._id.month).padStart(2, "0")}`,
        count: m.count,
      })),
      byMember,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };
