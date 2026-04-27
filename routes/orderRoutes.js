// const express = require('express');
// const router = express.Router();
// const {
//   createOrder,
//   getOrderStatus,
//   updateOrderStatus,
//   getActiveOrders,
//   cancelOrder,
//   getOrderById,
//   getAllOrders
// } = require('../controllers/orderController');
// const { protect, authorize } = require('../middleware/authMiddleware');

// // Public routes
// router.post('/', createOrder);
// router.get('/:orderId/status', getOrderStatus);
// router.post('/:orderId/cancel', cancelOrder);


// // Kitchen/Manager routes
// router.get('/active', authorize('chef', 'manager'), getActiveOrders);
// router.put('/:orderId/status', authorize('chef', 'manager'), updateOrderStatus);

// // Manager only routes
// router.get('/', getAllOrders);
// router.get('/:orderId', authorize('manager'), getOrderById);

// module.exports = router;











const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderStatus,
  updateOrderStatus,
  getActiveOrders,
  cancelOrder,
  getOrderById,
  getAllOrders
} = require('../controllers/orderController');

// ---------------- PUBLIC ROUTES ----------------

// Create order
router.post('/', createOrder);

// Get all orders (was manager only)
router.get('/', getAllOrders);

// Get active orders (was protected)
router.get('/active', getActiveOrders);

// ---------------- ORDER ACTIONS ----------------

// Get order status
router.get('/:orderId/status', getOrderStatus);

// Update order status
router.put('/:orderId/status', updateOrderStatus);

// Cancel order
router.post('/:orderId/cancel', cancelOrder);

// Get single order
router.get('/:orderId', getOrderById);

module.exports = router;