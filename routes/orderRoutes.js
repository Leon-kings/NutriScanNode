const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const analytics = require("../controllers/orderAnalyticsController");

// CREATE
router.post("/", orderController.createOrder);

// READ
router.get("/", orderController.getAllOrders);
router.get("/:orderId", orderController.getOrderById);

// UPDATE
router.put("/:orderId", orderController.updateOrder);

// DELETE
router.delete("/:orderId", orderController.deleteOrder);

router.get("/daily", analytics.getDailyReport);
router.get("/weekly", analytics.getWeeklyReport);

module.exports = router;
