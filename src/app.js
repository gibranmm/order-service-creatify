const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orderRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Order Service running successfully 🚀');
});

app.use('/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Order service is running on port ${PORT}`);
});
