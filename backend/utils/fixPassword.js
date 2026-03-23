const db = require("../config/database");
const bcrypt = require("bcryptjs");

const fixPassword = async () => {
  try {
    const phone = "0982310974";
    const password = "password123";

    console.log("🔍 Looking for staff with phone:", phone);

    // First check if staff exists
    const [staffRows] = await db.query("SELECT * FROM staff WHERE phone = ?", [
      phone,
    ]);

    if (staffRows.length === 0) {
      console.log("❌ Staff not found with phone:", phone);
      console.log("Creating new staff member...");

      // Generate hash for password
      const salt = await bcrypt.genSalt(10);
      const freshHash = await bcrypt.hash(password, salt);

      // Insert new staff
      await db.query(
        "INSERT INTO staff (name, phone, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
        ["Admin User", phone, "admin@chalamobile.com", freshHash, "admin"],
      );

      console.log("✅ New staff created with hash:", freshHash);
    } else {
      console.log("✅ Staff found:", staffRows[0].name);

      // Generate a fresh hash
      const salt = await bcrypt.genSalt(10);
      const freshHash = await bcrypt.hash(password, salt);

      console.log("Fresh hash created:", freshHash);

      // Update the database with this hash
      await db.query("UPDATE staff SET password_hash = ? WHERE phone = ?", [
        freshHash,
        phone,
      ]);

      console.log("✅ Database updated with fresh hash");
    }

    // Test the login immediately
    const [rows] = await db.query("SELECT * FROM staff WHERE phone = ?", [
      phone,
    ]);

    if (rows.length > 0) {
      const staff = rows[0];
      const isValid = await bcrypt.compare(password, staff.password_hash);

      console.log(
        "Password test after update:",
        isValid ? "✅ WORKS!" : "❌ Still failing",
      );

      if (isValid) {
        console.log("\n🎉 SUCCESS! Now login with:");
        console.log("Phone:", phone);
        console.log("Password:", password);
        console.log("Role:", staff.role);
      } else {
        console.log("\n❌ Password still not matching. Try manual SQL:");
        console.log("Run this in phpMyAdmin:");
        console.log(
          `UPDATE staff SET password_hash = '${freshHash}' WHERE phone = '${phone}';`,
        );
      }
    } else {
      console.log("❌ Could not retrieve staff after update");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Full error:", error);
  } finally {
    process.exit();
  }
};

fixPassword();
