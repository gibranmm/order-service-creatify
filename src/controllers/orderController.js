// src/controllers/orderController.js
const { createPaymentTransaction } = require('../services/paymentService');
const { addOrder, getOrderById: getOrderByIdFromDb, updateOrderStatusByOrderId } = require('../models/orderModel');

const createOrder = async (req, res) => {
  try {
    const { packageId, price, tax, serviceFee, total, customerName, customerEmail } = req.body;
    const order_id = 'ORDER-' + Date.now();

    const order = {
      order_id,
      packageId,
      price,
      tax,
      serviceFee,
      total,
      customerName,
      customerEmail,
      status: 'pending',
    };

    // panggil payment service
    const paymentRes = await createPaymentTransaction(order);
    order.payment_token = paymentRes.token;
    order.payment_redirect_url = paymentRes.redirect_url;

    // simpan ke db
    await addOrder(order);

    res.json({
      order_id: order.order_id,
      payment_token: order.payment_token,
      payment_redirect_url: order.payment_redirect_url,
      status: order.status,
    });
  } catch (error) {
    console.error('Create order error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await getOrderByIdFromDb(req.params.order_id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Get order error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const handleWebhook = async (req, res) => {
  try {
    const notification = req.body;
    console.log('Received Midtrans webhook:', notification);

    const order_id = notification.order_id;
    const transaction_status = notification.transaction_status;

    let newStatus = 'pending';
    if (transaction_status === 'settlement') newStatus = 'paid';
    else if (transaction_status === 'expire') newStatus = 'expired';
    else if (transaction_status === 'cancel') newStatus = 'failed';

    await updateOrderStatusByOrderId(order_id, newStatus);

    res.json({ message: 'Notification processed', newStatus });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ error: 'Failed to process notification' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  handleWebhook,
};
