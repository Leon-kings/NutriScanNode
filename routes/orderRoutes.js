const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// CREATE
router.post("/", orderController.createOrder);

// READ
router.get("/", orderController.getAllOrders);
router.get("/:orderId", orderController.getOrderById);

// UPDATE
router.put("/:orderId", orderController.updateOrder);

// DELETE
router.delete("/:orderId", orderController.deleteOrder);

module.exports = router;