const nodemailer = require("nodemailer");

// Create transporter (configure for your email provider)
const transporter = nodemailer.createTransport({
  service: "gmail", // or use your email provider
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password
  },
});

// Send receipt email
const sendReceiptEmail = async (transaction, saleData) => {
  try {
    const warrantyMonths = saleData?.warranty_months || 12;
    const validUntil = new Date(transaction.created_at);
    validUntil.setMonth(validUntil.getMonth() + warrantyMonths);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: transaction.customer_email, // Send to customer
      cc: "keroabdurehman@gmail.com", // CC to you
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
    console.log("✅ Receipt email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
};

// Send admin notification
const sendAdminNotification = async (transaction) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "keroabdurehman@gmail.com",
      subject: `💰 New Sale Alert - Chala Mobile`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #FF8500;">New Sale Completed!</h2>
          <p><strong>Transaction:</strong> ${transaction.tx_ref}</p>
          <p><strong>Product:</strong> ${transaction.product_name}</p>
          <p><strong>Amount:</strong> ETB ${transaction.amount.toLocaleString()}</p>
          <p><strong>Customer:</strong> ${transaction.customer_name}</p>
          <p><strong>Email:</strong> ${transaction.customer_email}</p>
          <p><strong>Phone:</strong> ${transaction.customer_phone || "Not provided"}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
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
