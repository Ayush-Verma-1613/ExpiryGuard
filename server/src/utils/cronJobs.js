const cron = require("node-cron");
const Item = require("../models/Item");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { sendEmail, buildReminderEmail } = require("./sendEmail");

const processReminders = async () => {
  console.log("[CRON] Processing reminders...");
  let reminded = 0;
  let expired = 0;

  try {
    const now = new Date();
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Find items expiring within 30 days
    const items = await Item.find({
      status: "active",
      expiryDate: { $gte: now, $lte: thirtyDaysFromNow },
    }).populate("categoryId", "name").populate("userId", "name email");

    // Group items by user for batch emails
    const userItems = {};

    for (const item of items) {
      const daysLeft = Math.ceil((item.expiryDate - now) / (1000 * 60 * 60 * 24));

      // Check if this matches any reminder day
      if (!item.reminderDays.includes(daysLeft)) continue;

      // Check if notification already sent
      const existing = await Notification.findOne({
        itemId: item._id,
        daysLeft,
        type: "reminder",
      });

      if (existing) continue;

      // Create notification record
      await Notification.create({
        type: "reminder",
        daysLeft,
        userId: item.userId._id,
        itemId: item._id,
      });

      const uid = item.userId._id.toString();
      if (!userItems[uid]) {
        userItems[uid] = {
          user: item.userId,
          items: [],
        };
      }

      userItems[uid].items.push({
        name: item.name,
        category: item.categoryId?.name || "Other",
        daysLeft,
      });

      reminded++;
    }

    // Send batch emails per user
    for (const uid of Object.keys(userItems)) {
      const { user, items: reminderItems } = userItems[uid];
      const html = buildReminderEmail(user.name, reminderItems);

      await sendEmail({
        to: user.email,
        subject: `ExpiryGuard: ${reminderItems.length} item(s) expiring soon`,
        html,
      });
    }

    // Auto-expire past-due items
    const expiredItems = await Item.updateMany(
      { status: "active", expiryDate: { $lt: now } },
      { status: "expired" }
    );
    expired = expiredItems.modifiedCount;

    console.log(`[CRON] Done: ${reminded} reminders sent, ${expired} items expired`);
  } catch (error) {
    console.error("[CRON] Error:", error.message);
  }
};

const startCronJobs = () => {
  // Run daily at 8:00 AM
  cron.schedule("0 8 * * *", processReminders);
  console.log("Cron jobs scheduled");
};

module.exports = { startCronJobs, processReminders };
