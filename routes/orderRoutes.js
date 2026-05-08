// const express = require("express");
// const router = express.Router();
// const orderController = require("../controllers/orderController");
// const analytics = require("../controllers/orderAnalyticsController");

// // CREATE
// router.post("/", orderController.createOrder);

// // READ
// router.get("/", orderController.getAllOrders);
// router.get("/:orderId", orderController.getOrderById);

// // UPDATE
// router.put("/:orderId", orderController.updateOrder);

// // DELETE
// router.delete("/:orderId", orderController.deleteOrder);

// router.get("/daily", analytics.getDailyReport);
// router.get("/weekly", analytics.getWeeklyReport);

// module.exports = router;










// const express = require("express");
// const router = express.Router();
// const order = require("../controllers/orderController");
// const analytics = require("../controllers/orderAnalyticsController");

// /* =========================
//    ANALYTICS FIRST
// ========================= */
// router.get("/analytics/daily", analytics.getDailyReport);
// router.get("/analytics/weekly", analytics.getWeeklyReport);

// /* =========================
//    ORDERS
// ========================= */
// router.post("/", order.createOrder);
// router.get("/", order.getAllOrders);
// router.get("/:orderId", order.getOrderById);
// router.put("/:orderId", order.updateOrder);
// router.delete("/:orderId", order.deleteOrder);

// module.exports = router;












const express = require("express");

const router = express.Router();

const order = require("../controllers/orderController");

const analytics = require(
  "../controllers/orderAnalyticsController"
);

/* =====================================================
   ANALYTICS ROUTES
===================================================== */

router.get(
  "/analytics/daily",
  analytics.getDailyReport
);

router.get(
  "/analytics/weekly",
  analytics.getWeeklyReport
);

/* =====================================================
   ORDER ROUTES
===================================================== */

/* CREATE ORDER */
router.post(
  "/",
  order.createOrder
);

/* GET ALL ORDERS */
router.get(
  "/",
  order.getAllOrders
);

/* GET SINGLE ORDER */
router.get(
  "/:orderId",
  order.getOrderById
);

/* EDIT ORDER */
router.put(
  "/:orderId",
  order.editOrder
);

/* UPDATE ORDER STATUS */
router.patch(
  "/:orderId/status",
  order.updateOrderStatus
);

/* DELETE ORDER */
router.delete(
  "/:orderId",
  order.deleteOrder
);

module.exports = router;