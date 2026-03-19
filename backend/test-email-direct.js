// Simple email test - NO DUPLICATES
const dotenv = require("dotenv");
const path = require("path");
const nodemailer = require("nodemailer");

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("📧 EMAIL TEST");
console.log("=============");
console.log("Current directory:", __dirname);
console.log(".env path:", path.join(__dirname, ".env"));
console.log("EMAIL_USER:", process.env.EMAIL_USER || "❌ NOT FOUND");
console.log(
  "EMAIL_PASS length:",
  process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : "❌ NOT FOUND",
);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("\n❌ Email credentials missing!");
  console.log("\nPlease create a .env file in this directory with:");
  console.log("EMAIL_USER=keroabdurehman@gmail.com");
  console.log("EMAIL_PASS=your_16_digit_app_password");
  process.exit(1);
}

// Test email function
async function sendTestEmail() {
  console.log("\n🔧 Creating transporter...");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    console.log("🔍 Verifying connection...");
    await transporter.verify();
    console.log("✅ Connection successful!");

    console.log("\n📨 Sending test email...");
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "keroabdurehman@gmail.com",
      subject: "✅ Test Email from Chala Mobile",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h1 style="color: #FF8500;">Email Working! 🎉</h1>
          <p>Your Chala Mobile email configuration is correct.</p>
          <hr>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    console.log("✅ Email sent! Message ID:", info.messageId);
    console.log("📬 Check your inbox at keroabdurehman@gmail.com");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.code === "EAUTH") {
      console.log("\n🔑 Authentication failed. Check your app password:");
      console.log("1. Go to: https://myaccount.google.com/apppasswords");
      console.log("2. Generate a new app password");
      console.log("3. Update your .env file with the new password");
    }
  }
}

// Run the test
sendTestEmail();
