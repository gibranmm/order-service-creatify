require('dotenv').config();
const axios = require('axios');

const createPaymentTransaction = async (order) => {
  try {
    const res = await axios.post(process.env.PAYMENT_SERVICE_URL, {
      order_id: order.order_id,
      amount: order.total,
      first_name: order.customerName,
      email: order.customerEmail,
    });
    return res.data;
  } catch (error) {
    console.error('Error calling payment service:', error.response?.data || error.message);
    throw new Error('Failed to create payment transaction');
  }
};

module.exports = { createPaymentTransaction };
