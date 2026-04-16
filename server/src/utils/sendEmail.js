const transporter = require("../config/email");

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Email send failed:", error.message);
    return false;
  }
};

const buildReminderEmail = (userName, items) => {
  const itemRows = items
    .map((item) => {
      const days = item.daysLeft;
      const urgency =
        days <= 1 ? "#ef4444" : days <= 7 ? "#f97316" : "#eab308";
      return `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb">${item.name}</td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb">${item.category}</td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb">
            <span style="color:${urgency};font-weight:bold">
              ${days <= 0 ? "Expired!" : `${days} day${days === 1 ? "" : "s"} left`}
            </span>
          </td>
        </tr>`;
    })
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#6366f1">ExpiryGuard Reminder</h2>
      <p>Hi ${userName},</p>
      <p>The following items need your attention:</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead>
          <tr style="background:#f9fafb">
            <th style="padding:12px;text-align:left;border-bottom:2px solid #e5e7eb">Item</th>
            <th style="padding:12px;text-align:left;border-bottom:2px solid #e5e7eb">Category</th>
            <th style="padding:12px;text-align:left;border-bottom:2px solid #e5e7eb">Status</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <p style="color:#6b7280;font-size:14px">
        Login to ExpiryGuard to manage your items and update their status.
      </p>
    </div>
  `;
};

module.exports = { sendEmail, buildReminderEmail };
