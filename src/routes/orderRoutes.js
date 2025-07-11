const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/webhook', orderController.handleWebhook);
router.get('/:order_id', orderController.getOrderById);
router.post('/', orderController.createOrder);

module.exports = router;
