const db = require("../config/database");

const createTransactionsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      tx_ref VARCHAR(100) UNIQUE NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'ETB',
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(20),
      product_name VARCHAR(255) NOT NULL,
      product_id INT,
      status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
      payment_method VARCHAR(50),
      chapa_transaction_id VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_tx_ref (tx_ref),
      INDEX idx_status (status),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    )
  `);
  console.log("✅ Transactions table ready");
};

createTransactionsTable();

module.exports = {
  // Save new transaction
  saveTransaction: async (txData) => {
    const [result] = await db.query(
      `INSERT INTO transactions 
       (tx_ref, amount, customer_name, customer_email, customer_phone, product_name, product_id, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        txData.tx_ref,
        txData.amount,
        txData.customer_name,
        txData.customer_email,
        txData.customer_phone,
        txData.product_name,
        txData.product_id,
        "pending",
      ],
    );
    return result.insertId;
  },

  // Update transaction status
  updateTransactionStatus: async (
    tx_ref,
    status,
    chapa_transaction_id = null,
  ) => {
    const query = chapa_transaction_id
      ? "UPDATE transactions SET status = ?, chapa_transaction_id = ? WHERE tx_ref = ?"
      : "UPDATE transactions SET status = ? WHERE tx_ref = ?";

    const params = chapa_transaction_id
      ? [status, chapa_transaction_id, tx_ref]
      : [status, tx_ref];

    await db.query(query, params);
  },

  // Get transaction by reference
  getTransactionByRef: async (tx_ref) => {
    const [rows] = await db.query(
      "SELECT * FROM transactions WHERE tx_ref = ?",
      [tx_ref],
    );
    return rows[0];
  },

  // Get user's transactions
  getUserTransactions: async (email) => {
    const [rows] = await db.query(
      "SELECT * FROM transactions WHERE customer_email = ? ORDER BY created_at DESC",
      [email],
    );
    return rows;
  },
};
