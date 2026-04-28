// const Order = require("../models/Order");

// class OrderStatusManager {
//   static orderTimeouts = new Map();

//   static startOrderStatusUpdates(orderId) {
//     // Clear old timeouts
//     this.cleanupOrder(orderId);

//     const preparing = setTimeout(async () => {
//       await this.updateStatus(orderId, "preparing", "Kitchen is preparing your order!");
//     }, 5000);

//     const ready = setTimeout(async () => {
//       await this.updateStatus(orderId, "ready", "Your order is ready!");
//     }, 15000);

//     const completed = setTimeout(async () => {
//       await this.updateStatus(orderId, "completed", "Order completed!");
//     }, 25000);

//     this.orderTimeouts.set(`${orderId}_preparing`, preparing);
//     this.orderTimeouts.set(`${orderId}_ready`, ready);
//     this.orderTimeouts.set(`${orderId}_completed`, completed);
//   }

//   static async updateStatus(orderId, status, note) {
//     const order = await Order.findOne({ orderId });
//     if (!order) return;

//     order.status = status;
//     order.bookingDetails.currentStatus = status;

//     order.bookingDetails.statusHistory.push({
//       status,
//       timestamp: new Date().toISOString(),
//       note,
//     });

//     await order.save();
//   }

//   static cleanupOrder(orderId) {
//     ["preparing", "ready", "completed"].forEach((stage) => {
//       const key = `${orderId}_${stage}`;
//       if (this.orderTimeouts.has(key)) {
//         clearTimeout(this.orderTimeouts.get(key));
//       }
//     });
//   }
// }

// module.exports = OrderStatusManager;












// utils/OrderStatusManager.js
const Order = require("../models/Order");

class OrderStatusManager {
  static timeouts = new Map();

  static start(orderId) {
    this.cleanup(orderId);

    const steps = [
      { status: "preparing", delay: 5000, note: "Preparing order" },
      { status: "ready", delay: 15000, note: "Order ready" },
      { status: "completed", delay: 25000, note: "Order completed" },
    ];

    steps.forEach((step) => {
      const timeout = setTimeout(() => {
        this.update(orderId, step.status, step.note);
      }, step.delay);

      this.timeouts.set(`${orderId}_${step.status}`, timeout);
    });
  }

  static async update(orderId, status, note) {
    try {
      const order = await Order.findOne({ orderId });
      if (!order) return;

      order.status = status;

      if (!order.bookingDetails) order.bookingDetails = {};

      order.bookingDetails.currentStatus = status;

      if (!order.bookingDetails.statusHistory) {
        order.bookingDetails.statusHistory = [];
      }

      order.bookingDetails.statusHistory.push({
        status,
        timestamp: new Date(),
        note,
      });

      await order.save();
    } catch (err) {
      console.error("Status update error:", err);
    }
  }

  static cleanup(orderId) {
    ["preparing", "ready", "completed"].forEach((s) => {
      const key = `${orderId}_${s}`;
      if (this.timeouts.has(key)) {
        clearTimeout(this.timeouts.get(key));
        this.timeouts.delete(key);
      }
    });
  }
}

module.exports = OrderStatusManager;