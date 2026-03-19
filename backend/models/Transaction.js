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
      warranty_months INT DEFAULT 12,
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
  console.log("✅ Transactions table ready with warranty_months field");
};

createTransactionsTable();

module.exports = {
  // Save new transaction
  saveTransaction: async (txData) => {
    const [result] = await db.query(
      `INSERT INTO transactions 
       (tx_ref, amount, customer_name, customer_email, customer_phone, product_name, product_id, warranty_months, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        txData.tx_ref,
        txData.amount,
        txData.customer_name,
        txData.customer_email,
        txData.customer_phone,
        txData.product_name,
        txData.product_id,
        txData.warranty_months || 12,
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
    let query, params;

    if (chapa_transaction_id) {
      query =
        "UPDATE transactions SET status = ?, chapa_transaction_id = ? WHERE tx_ref = ?";
      params = [status, chapa_transaction_id, tx_ref];
    } else {
      query = "UPDATE transactions SET status = ? WHERE tx_ref = ?";
      params = [status, tx_ref];
    }

    await db.query(query, params);
  },

  // Update transaction with payment method
  updateTransactionPaymentDetails: async (
    tx_ref,
    payment_method,
    chapa_transaction_id,
  ) => {
    const query =
      "UPDATE transactions SET payment_method = ?, chapa_transaction_id = ? WHERE tx_ref = ?";
    await db.query(query, [payment_method, chapa_transaction_id, tx_ref]);
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

  // Get all transactions (for admin)
  getAllTransactions: async () => {
    const [rows] = await db.query(
      "SELECT * FROM transactions ORDER BY created_at DESC",
    );
    return rows;
  },

  // Get pending transactions
  getPendingTransactions: async () => {
    const [rows] = await db.query(
      "SELECT * FROM transactions WHERE status = 'pending' ORDER BY created_at DESC",
    );
    return rows;
  },

  // Get completed transactions
  getCompletedTransactions: async () => {
    const [rows] = await db.query(
      "SELECT * FROM transactions WHERE status = 'completed' ORDER BY created_at DESC",
    );
    return rows;
  },

  // Delete transaction (admin only)
  deleteTransaction: async (tx_ref) => {
    const [result] = await db.query(
      "DELETE FROM transactions WHERE tx_ref = ?",
      [tx_ref],
    );
    return result.affectedRows > 0;
  },

  // Get transactions by date range
  getTransactionsByDateRange: async (startDate, endDate) => {
    const [rows] = await db.query(
      "SELECT * FROM transactions WHERE DATE(created_at) BETWEEN ? AND ? ORDER BY created_at DESC",
      [startDate, endDate],
    );
    return rows;
  },

  // Get transaction statistics
  getTransactionStats: async () => {
    const [total] = await db.query(
      "SELECT COUNT(*) as count, SUM(amount) as total FROM transactions WHERE status = 'completed'",
    );

    const [today] = await db.query(
      "SELECT COUNT(*) as count, SUM(amount) as total FROM transactions WHERE DATE(created_at) = CURDATE() AND status = 'completed'",
    );

    const [byStatus] = await db.query(
      "SELECT status, COUNT(*) as count, SUM(amount) as total FROM transactions GROUP BY status",
    );

    return {
      total: total[0],
      today: today[0],
      byStatus: byStatus,
    };
  },
};
