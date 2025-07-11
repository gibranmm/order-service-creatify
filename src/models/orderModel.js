const db = require('../db');

async function addOrder(order) {
  const [result] = await db.execute(
    `INSERT INTO orders 
     (order_id, package_id, customer_name, customer_email, price, tax, service_fee, total, payment_token, payment_redirect_url, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order.order_id, order.packageId, order.customerName, order.customerEmail,
      order.price, order.tax, order.serviceFee, order.total,
      order.payment_token, order.payment_redirect_url, order.status
    ]
  );
  return result;
}

async function getOrderById(order_id) {
  const [rows] = await db.execute(
    `SELECT * FROM orders WHERE order_id = ?`, [order_id]
  );
  return rows[0];
}

async function updateOrderStatusByOrderId(order_id, status) {
  const [result] = await db.execute(
    `UPDATE orders SET status = ? WHERE order_id = ?`,
    [status, order_id]
  );
  return result;
}

module.exports = {
  addOrder,
  getOrderById,
  updateOrderStatusByOrderId
};
