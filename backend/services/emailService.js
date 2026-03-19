// backend/services/emailService.js
require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env"),
});

const nodemailer = require("nodemailer");

// Check if email credentials exist
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ Email credentials missing in .env file");
  console.error("Please set EMAIL_USER and EMAIL_PASS in your .env file");
  process.exit(1);
}

console.log("📧 Email service initializing...");
console.log("📧 Using account:", process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email service connection failed:", error);
  } else {
    console.log("✅ Email service ready to send messages");
  }
});

const sendReceiptEmail = async (transaction, saleData) => {
  try {
    console.log(`📧 Sending receipt email to: ${transaction.customer_email}`);

    const warrantyMonths = saleData?.warranty_months || 12;
    const validUntil = new Date(transaction.created_at);
    validUntil.setMonth(validUntil.getMonth() + warrantyMonths);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: transaction.customer_email,
      cc: "keroabdurehman@gmail.com",
      subject: `🧾 Payment Confirmation - Chala Mobile`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #FF8500; margin-bottom: 5px;">Chala Mobile</h1>
            <p style="color: #666;">Payment Receipt</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #28a745; margin-top: 0;">✅ Payment Successful!</h2>
            <p>Thank you for your purchase. Your transaction has been completed successfully.</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; color: #666;">Transaction Reference:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">${transaction.tx_ref}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; color: #666;">Date:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${new Date(transaction.created_at).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; color: #666;">Product:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">${transaction.product_name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; color: #666;">Amount:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #FF8500;">ETB ${transaction.amount.toLocaleString()}</td>
            </tr>
          </table>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #FF8500; margin-top: 0;">Customer Details</h3>
            <p><strong>Name:</strong> ${transaction.customer_name}</p>
            <p><strong>Email:</strong> ${transaction.customer_email}</p>
            <p><strong>Phone:</strong> ${transaction.customer_phone || "Not provided"}</p>
          </div>
          
          <div style="border: 2px solid #FF8500; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #FF8500; margin-top: 0;">📜 Warranty Information</h3>
            <p><strong>Warranty Period:</strong> ${warrantyMonths} months</p>
            <p><strong>Valid From:</strong> ${new Date(transaction.created_at).toLocaleDateString()}</p>
            <p><strong>Valid Until:</strong> ${validUntil.toLocaleDateString()}</p>
            <p style="font-size: 0.9em; color: #666;">This receipt serves as your warranty proof. Please keep it for future reference.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 0.9em;">Chala Mobile Solutions Hub<br>Abosto, Shashemene, Ethiopia<br>📞 +251 98 231 0974</p>
            <p style="color: #999; font-size: 0.8em;">Thank you for choosing Chala Mobile!</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `✅ Receipt email sent to ${transaction.customer_email}:`,
      info.messageId,
    );
    return info;
  } catch (error) {
    console.error("❌ Failed to send receipt email:", error);
    throw error;
  }
};

const sendAdminNotification = async (transaction) => {
  try {
    console.log(
      `📧 Sending admin notification for transaction: ${transaction.tx_ref}`,
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "keroabdurehman@gmail.com",
      subject: `💰 New Sale Alert - Chala Mobile`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2 style="color: #FF8500; margin-top: 0;">💰 New Sale Completed!</h2>
          <p style="font-size: 16px; color: #333;">A new sale has been successfully processed.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; background-color: #f5f5f5; font-weight: bold;">Transaction:</td>
              <td style="padding: 8px;">${transaction.tx_ref}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f5f5f5; font-weight: bold;">Product:</td>
              <td style="padding: 8px;">${transaction.product_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f5f5f5; font-weight: bold;">Amount:</td>
              <td style="padding: 8px; color: #FF8500; font-weight: bold;">ETB ${transaction.amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f5f5f5; font-weight: bold;">Customer:</td>
              <td style="padding: 8px;">${transaction.customer_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f5f5f5; font-weight: bold;">Email:</td>
              <td style="padding: 8px;">${transaction.customer_email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f5f5f5; font-weight: bold;">Phone:</td>
              <td style="padding: 8px;">${transaction.customer_phone || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background-color: #f5f5f5; font-weight: bold;">Date:</td>
              <td style="padding: 8px;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
          
          <p style="color: #666; font-size: 14px;">This is an automated notification from Chala Mobile.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Admin notification sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send admin notification:", error);
  }
};

module.exports = {
  sendReceiptEmail,
  sendAdminNotification,
};
