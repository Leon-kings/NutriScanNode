// const Order = require('../models/Order');
// const OrderStatus = require('../models/OrderStatus');

// // In-memory storage for active listeners (for WebSocket/SSE)
// const statusListeners = new Map();

// class OrderStatusService {
  
//   /**
//    * Send order to database
//    */
//   static async sendOrderToDatabase(orderData) {
//     try {
//       // Generate unique IDs
//       const orderId = Order.generateOrderId();
//       const bookingId = Order.generateBookingId();
      
//       // Calculate estimated pickup time (default 30 minutes from now)
//       const estimatedPickupTime = orderData.estimatedPickupTime || 
//         new Date(Date.now() + 30 * 60000);
      
//       // Create order payload
//       const order = new Order({
//         personDetails: {
//           name: orderData.customerName,
//           tableNumber: orderData.tableNumber,
//           orderType: orderData.orderType || "dine-in",
//           phoneNumber: orderData.phoneNumber,
//           deliveryAddress: orderData.deliveryAddress
//         },
//         bookingDetails: {
//           bookingId: bookingId,
//           orderId: orderId,
//           orderDate: new Date(),
//           estimatedPickupTime: estimatedPickupTime,
//           preparationStatus: "confirmed",
//           currentStatus: "confirmed",
//           statusHistory: [{
//             status: "confirmed",
//             timestamp: new Date(),
//             note: "Order confirmed"
//           }],
//           specialInstructions: orderData.notes || ""
//         },
//         plateRecommendations: orderData.customizedPlates?.map((plate, idx) => ({
//           plateId: `PLT_${Date.now()}_${idx}`,
//           originalName: plate.name,
//           customizations: plate.customizations || [],
//           specialInstructions: plate.instructions || ""
//         })) || [],
//         orderSummary: {
//           items: orderData.items.map((item) => ({
//             id: item.id,
//             name: item.name,
//             quantity: item.quantity,
//             originalPrice: item.price,
//             finalPrice: item.finalPrice,
//             customizations: item.customizations || [],
//             specialInstructions: item.specialInstructions || "",
//             preparationTime: item.prepTime || 15
//           })),
//           subtotal: orderData.subtotal,
//           total: orderData.total,
//           totalItems: orderData.items.reduce((sum, item) => sum + item.quantity, 0)
//         },
//         metadata: {
//           source: "NutriScan-AI-App",
//           version: "1.0.0",
//           timestamp: new Date(),
//           ...orderData.metadata
//         },
//         status: "confirmed"
//       });
      
//       // Save order to database
//       await order.save();
      
//       // Create order status tracking record
//       const orderStatus = new OrderStatus({
//         orderId: orderId,
//         bookingId: bookingId,
//         status: "confirmed",
//         statusMessage: "Order confirmed and waiting for kitchen",
//         statusHistory: [{
//           status: "confirmed",
//           timestamp: new Date(),
//           message: "Order confirmed and waiting for kitchen"
//         }]
//       });
      
//       await orderStatus.save();
      
//       // Start scheduled status updates
//       await this.startOrderStatusUpdates(orderId);
      
//       return {
//         success: true,
//         orderId: orderId,
//         bookingId: bookingId,
//         message: "Order successfully placed!",
//         estimatedPickupTime: estimatedPickupTime
//       };
      
//     } catch (error) {
//       console.error("API Error:", error);
//       return {
//         success: false,
//         error: error.message,
//         message: "Failed to place order. Please try again."
//       };
//     }
//   }
  
//   /**
//    * Start automated order status updates
//    */
//   static async startOrderStatusUpdates(orderId) {
//     const order = await Order.findByOrderId(orderId);
//     const orderStatus = await OrderStatus.findOne({ orderId });
    
//     if (!order || !orderStatus) {
//       console.error(`Order ${orderId} not found for status updates`);
//       return;
//     }
    
//     // Calculate time delays (in milliseconds)
//     const PREPARING_DELAY = 5000;   // 5 seconds to preparing
//     const READY_DELAY = 15000;      // 15 seconds to ready
//     const COMPLETED_DELAY = 25000;   // 25 seconds to completed
    
//     const now = new Date();
    
//     // Schedule preparing status update
//     const preparingTime = new Date(now.getTime() + PREPARING_DELAY);
//     await orderStatus.scheduleStatusUpdate('preparingTimeout', preparingTime);
    
//     // Schedule ready status update
//     const readyTime = new Date(now.getTime() + READY_DELAY);
//     await orderStatus.scheduleStatusUpdate('readyTimeout', readyTime);
    
//     // Schedule completed status update
//     const completedTime = new Date(now.getTime() + COMPLETED_DELAY);
//     await orderStatus.scheduleStatusUpdate('completedTimeout', completedTime);
    
//     // Log scheduled updates
//     console.log(`Scheduled status updates for order ${orderId}:`);
//     console.log(`  - Preparing at: ${preparingTime}`);
//     console.log(`  - Ready at: ${readyTime}`);
//     console.log(`  - Completed at: ${completedTime}`);
//   }
  
//   /**
//    * Process pending status updates (called by cron job or setInterval)
//    */
//   static async processPendingStatusUpdates() {
//     const pendingTimeouts = await OrderStatus.findPendingTimeouts();
    
//     for (const orderStatus of pendingTimeouts) {
//       const now = new Date();
//       const order = await Order.findByOrderId(orderStatus.orderId);
      
//       if (!order || !order.isActive === false) continue;
      
//       // Check preparing timeout
//       if (!orderStatus.activeTimeouts.preparingTimeout?.isExecuted &&
//           orderStatus.activeTimeouts.preparingTimeout?.scheduledAt <= now &&
//           orderStatus.status === 'confirmed') {
        
//         await this.updateOrderStatus(orderStatus.orderId, 'preparing', 'Kitchen is preparing your order!');
//         await orderStatus.markTimeoutExecuted('preparingTimeout');
//         this.notifyListeners(orderStatus.orderId, 'preparing', 'Kitchen is preparing your order!');
//       }
      
//       // Check ready timeout
//       if (!orderStatus.activeTimeouts.readyTimeout?.isExecuted &&
//           orderStatus.activeTimeouts.readyTimeout?.scheduledAt <= now &&
//           orderStatus.status === 'preparing') {
        
//         await this.updateOrderStatus(orderStatus.orderId, 'ready', 'Your order is ready for pickup!');
//         await orderStatus.markTimeoutExecuted('readyTimeout');
//         this.notifyListeners(orderStatus.orderId, 'ready', 'Your order is ready for pickup!');
//       }
      
//       // Check completed timeout
//       if (!orderStatus.activeTimeouts.completedTimeout?.isExecuted &&
//           orderStatus.activeTimeouts.completedTimeout?.scheduledAt <= now &&
//           orderStatus.status === 'ready') {
        
//         await this.updateOrderStatus(orderStatus.orderId, 'completed', 'Order completed! Enjoy your meal!');
//         await orderStatus.markTimeoutExecuted('completedTimeout');
//         this.notifyListeners(orderStatus.orderId, 'completed', 'Order completed! Enjoy your meal!');
//       }
//     }
//   }
  
//   /**
//    * Update order status manually
//    */
//   static async updateOrderStatus(orderId, newStatus, message = null, userId = null) {
//     try {
//       const order = await Order.findByOrderId(orderId);
//       const orderStatus = await OrderStatus.findOne({ orderId });
      
//       if (!order || !orderStatus) {
//         return { success: false, message: 'Order not found' };
//       }
      
//       // Check if status transition is valid
//       const validTransitions = {
//         confirmed: ['preparing', 'cancelled'],
//         preparing: ['ready', 'cancelled'],
//         ready: ['completed', 'cancelled'],
//         completed: [],
//         cancelled: []
//       };
      
//       if (!validTransitions[orderStatus.status].includes(newStatus)) {
//         return { 
//           success: false, 
//           message: `Cannot transition from ${orderStatus.status} to ${newStatus}` 
//         };
//       }
      
//       // Update order
//       await order.addStatusHistory(newStatus, message || '', userId);
      
//       // Update order status tracking
//       const statusMessage = message || orderStatus.getStatusMessage(newStatus);
//       await orderStatus.addStatusChange(newStatus, statusMessage, userId);
      
//       // Notify listeners
//       this.notifyListeners(orderId, newStatus, statusMessage);
      
//       return {
//         success: true,
//         status: newStatus,
//         message: statusMessage,
//         orderId: orderId
//       };
      
//     } catch (error) {
//       console.error('Update order status error:', error);
//       return {
//         success: false,
//         message: error.message
//       };
//     }
//   }
  
//   /**
//    * Get order status
//    */
//   static async getOrderStatus(orderId) {
//     try {
//       const order = await Order.findByOrderId(orderId);
//       const orderStatus = await OrderStatus.findOne({ orderId });
      
//       if (order && orderStatus) {
//         // Calculate estimated time remaining
//         let estimatedTimeRemaining = 0;
//         const now = new Date();
        
//         if (orderStatus.status === 'confirmed') {
//           const preparingTime = orderStatus.activeTimeouts.preparingTimeout?.scheduledAt;
//           if (preparingTime && preparingTime > now) {
//             estimatedTimeRemaining = Math.ceil((preparingTime - now) / 60000);
//           }
//         } else if (orderStatus.status === 'preparing') {
//           const readyTime = orderStatus.activeTimeouts.readyTimeout?.scheduledAt;
//           if (readyTime && readyTime > now) {
//             estimatedTimeRemaining = Math.ceil((readyTime - now) / 60000);
//           }
//         }
        
//         return {
//           success: true,
//           status: orderStatus.status,
//           orderId: orderId,
//           bookingId: order.bookingDetails.bookingId,
//           statusMessage: orderStatus.statusMessage,
//           estimatedTimeRemaining: estimatedTimeRemaining,
//           statusHistory: orderStatus.statusHistory,
//           orderSummary: order.orderSummary,
//           personDetails: order.personDetails,
//           estimatedPickupTime: order.bookingDetails.estimatedPickupTime,
//           message: `Order ${orderId} is ${orderStatus.status}`
//         };
//       }
      
//       return {
//         success: false,
//         status: "not_found",
//         message: "Order not found. Please check the Order ID and try again."
//       };
      
//     } catch (error) {
//       console.error('Get order status error:', error);
//       return {
//         success: false,
//         message: error.message
//       };
//     }
//   }
  
//   /**
//    * Get all active orders (for kitchen display)
//    */
//   static async getActiveOrders() {
//     try {
//       const orders = await Order.findActiveOrders()
//         .populate('assignedTo', 'name email')
//         .lean();
      
//       const activeOrders = [];
      
//       for (const order of orders) {
//         const orderStatus = await OrderStatus.findOne({ 
//           orderId: order.bookingDetails.orderId 
//         });
        
//         activeOrders.push({
//           ...order,
//           statusTracking: orderStatus,
//           estimatedCompletion: order.getEstimatedCompletionTime()
//         });
//       }
      
//       return {
//         success: true,
//         count: activeOrders.length,
//         orders: activeOrders
//       };
      
//     } catch (error) {
//       console.error('Get active orders error:', error);
//       return {
//         success: false,
//         message: error.message
//       };
//     }
//   }
  
//   /**
//    * Notify all listeners of status change
//    */
//   static notifyListeners(orderId, status, message) {
//     const notification = { status, message, orderId, timestamp: new Date() };
    
//     statusListeners.forEach((callback, listenerId) => {
//       try {
//         callback(notification);
//       } catch (error) {
//         console.error(`Error notifying listener ${listenerId}:`, error);
//       }
//     });
//   }
  
//   /**
//    * Add status listener (for SSE/WebSocket)
//    */
//   static addStatusListener(id, callback) {
//     statusListeners.set(id, callback);
//     return () => this.removeStatusListener(id);
//   }
  
//   /**
//    * Remove status listener
//    */
//   static removeStatusListener(id) {
//     statusListeners.delete(id);
//   }
  
//   /**
//    * Get listener count
//    */
//   static getListenerCount() {
//     return statusListeners.size;
//   }
  
//   /**
//    * Cancel order
//    */
//   static async cancelOrder(orderId, reason = null, userId = null) {
//     try {
//       const order = await Order.findByOrderId(orderId);
//       const orderStatus = await OrderStatus.findOne({ orderId });
      
//       if (!order || !orderStatus) {
//         return { success: false, message: 'Order not found' };
//       }
      
//       if (orderStatus.status === 'completed') {
//         return { success: false, message: 'Cannot cancel completed order' };
//       }
      
//       if (orderStatus.status === 'cancelled') {
//         return { success: false, message: 'Order is already cancelled' };
//       }
      
//       const cancelMessage = reason || 'Order cancelled by customer';
//       await order.addStatusHistory('cancelled', cancelMessage, userId);
//       await orderStatus.addStatusChange('cancelled', cancelMessage, userId);
      
//       order.isActive = false;
//       orderStatus.isActive = false;
//       await order.save();
//       await orderStatus.save();
      
//       this.notifyListeners(orderId, 'cancelled', cancelMessage);
      
//       return {
//         success: true,
//         message: 'Order cancelled successfully',
//         orderId: orderId
//       };
      
//     } catch (error) {
//       console.error('Cancel order error:', error);
//       return {
//         success: false,
//         message: error.message
//       };
//     }
//   }
  
//   /**
//    * Clean up completed orders (call by cron job)
//    */
//   static async cleanupCompletedOrders(daysOld = 7) {
//     const cutoffDate = new Date();
//     cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
//     const result = await Order.updateMany(
//       { 
//         status: 'completed',
//         updatedAt: { $lt: cutoffDate }
//       },
//       { isActive: false }
//     );
    
//     return {
//       success: true,
//       ordersArchived: result.modifiedCount
//     };
//   }
// }

// // Start background processor for pending status updates
// let intervalId = null;

// const startStatusProcessor = () => {
//   if (intervalId) clearInterval(intervalId);
  
//   intervalId = setInterval(async () => {
//     try {
//       await OrderStatusService.processPendingStatusUpdates();
//     } catch (error) {
//       console.error('Status processor error:', error);
//     }
//   }, 1000); // Check every second
  
//   console.log('✅ Order status processor started (checking every second)');
// };

// const stopStatusProcessor = () => {
//   if (intervalId) {
//     clearInterval(intervalId);
//     intervalId = null;
//     console.log('⏹️ Order status processor stopped');
//   }
// };

// module.exports = {
//   OrderStatusService,
//   startStatusProcessor,
//   stopStatusProcessor
// };






const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');

// In-memory listeners
const statusListeners = new Map();

class OrderStatusService {

  // ---------------- CREATE ORDER ----------------
  static async sendOrderToDatabase(orderData) {
    try {
      const orderId = Order.generateOrderId();
      const bookingId = Order.generateBookingId();

      const estimatedPickupTime =
        orderData.estimatedPickupTime ||
        new Date(Date.now() + 30 * 60000);

      const order = new Order({
        personDetails: {
          name: orderData.customerName,
          tableNumber: orderData.tableNumber,
          orderType: orderData.orderType || "dine-in",
          phoneNumber: orderData.phoneNumber,
          deliveryAddress: orderData.deliveryAddress
        },
        bookingDetails: {
          bookingId,
          orderId,
          orderDate: new Date(),
          estimatedPickupTime,
          preparationStatus: "confirmed",
          currentStatus: "confirmed",
          statusHistory: [{
            status: "confirmed",
            timestamp: new Date(),
            note: "Order confirmed"
          }],
          specialInstructions: orderData.notes || ""
        },
        plateRecommendations: orderData.customizedPlates?.map((plate, idx) => ({
          plateId: `PLT_${Date.now()}_${idx}`,
          originalName: plate.name,
          customizations: plate.customizations || [],
          specialInstructions: plate.instructions || ""
        })) || [],
        orderSummary: {
          items: orderData.items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            originalPrice: item.price,
            finalPrice: item.finalPrice,
            customizations: item.customizations || [],
            specialInstructions: item.specialInstructions || "",
            preparationTime: item.prepTime || 15
          })),
          subtotal: orderData.subtotal,
          total: orderData.total,
          totalItems: orderData.items.reduce((sum, i) => sum + i.quantity, 0)
        },
        metadata: {
          source: "NutriScan-AI-App",
          version: "1.0.0",
          timestamp: new Date(),
          ...orderData.metadata
        },
        status: "confirmed"
      });

      await order.save();

      const orderStatus = new OrderStatus({
        orderId,
        bookingId,
        status: "confirmed",
        statusMessage: "Order confirmed and waiting for kitchen",
        statusHistory: [{
          status: "confirmed",
          timestamp: new Date(),
          message: "Order confirmed and waiting for kitchen"
        }]
      });

      await orderStatus.save();

      await this.startOrderStatusUpdates(orderId);

      return {
        success: true,
        orderId,
        bookingId,
        message: "Order successfully placed!",
        estimatedPickupTime
      };

    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        message: "Failed to place order",
        error: error.message
      };
    }
  }

  // ---------------- SCHEDULE UPDATES ----------------
  static async startOrderStatusUpdates(orderId) {
    const [order, orderStatus] = await Promise.all([
      Order.findByOrderId(orderId),
      OrderStatus.findOne({ orderId })
    ]);

    if (!order || !orderStatus) return;

    const now = Date.now();

    await Promise.all([
      orderStatus.scheduleStatusUpdate('preparingTimeout', new Date(now + 5000)),
      orderStatus.scheduleStatusUpdate('readyTimeout', new Date(now + 15000)),
      orderStatus.scheduleStatusUpdate('completedTimeout', new Date(now + 25000))
    ]);
  }

  // ---------------- PROCESS UPDATES ----------------
  static async processPendingStatusUpdates() {
    const pending = await OrderStatus.findPendingTimeouts();

    for (const os of pending) {
      const now = new Date();

      const order = await Order.findByOrderId(os.orderId);
      if (!order || order.isActive === false) continue;

      const check = async (key, current, next, message) => {
        const t = os.activeTimeouts[key];
        if (!t?.isExecuted && t?.scheduledAt <= now && os.status === current) {
          await this.updateOrderStatus(os.orderId, next, message);
          await os.markTimeoutExecuted(key);
          this.notifyListeners(os.orderId, next, message);
        }
      };

      await check('preparingTimeout', 'confirmed', 'preparing', 'Kitchen is preparing your order!');
      await check('readyTimeout', 'preparing', 'ready', 'Your order is ready!');
      await check('completedTimeout', 'ready', 'completed', 'Order completed!');
    }
  }

  // ---------------- UPDATE STATUS ----------------
  static async updateOrderStatus(orderId, newStatus, message = null, userId = null) {
    try {
      const [order, orderStatus] = await Promise.all([
        Order.findByOrderId(orderId),
        OrderStatus.findOne({ orderId })
      ]);

      if (!order || !orderStatus) {
        return { success: false, message: 'Order not found' };
      }

      const valid = {
        confirmed: ['preparing', 'cancelled'],
        preparing: ['ready', 'cancelled'],
        ready: ['completed', 'cancelled'],
        completed: [],
        cancelled: []
      };

      if (!valid[orderStatus.status].includes(newStatus)) {
        return { success: false, message: 'Invalid status transition' };
      }

      const msg = message || orderStatus.getStatusMessage(newStatus);

      await Promise.all([
        order.addStatusHistory(newStatus, msg, userId),
        orderStatus.addStatusChange(newStatus, msg, userId)
      ]);

      this.notifyListeners(orderId, newStatus, msg);

      return { success: true, status: newStatus };

    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
  }

  // ---------------- LISTENERS ----------------
  static notifyListeners(orderId, status, message) {
    const payload = { orderId, status, message, timestamp: new Date() };

    for (const [id, cb] of statusListeners.entries()) {
      try {
        cb(payload);
      } catch {
        statusListeners.delete(id); // 🔥 auto-clean broken listeners
      }
    }
  }

  static addStatusListener(id, cb) {
    statusListeners.set(id, cb);

    return () => {
      statusListeners.delete(id);
    };
  }

  static getListenerCount() {
    return statusListeners.size;
  }

  // ---------------- CANCEL ----------------
  static async cancelOrder(orderId, reason = null, userId = null) {
    try {
      const [order, orderStatus] = await Promise.all([
        Order.findByOrderId(orderId),
        OrderStatus.findOne({ orderId })
      ]);

      if (!order || !orderStatus) {
        return { success: false, message: 'Order not found' };
      }

      if (['completed', 'cancelled'].includes(orderStatus.status)) {
        return { success: false, message: 'Cannot cancel this order' };
      }

      const msg = reason || 'Order cancelled';

      await Promise.all([
        order.addStatusHistory('cancelled', msg, userId),
        orderStatus.addStatusChange('cancelled', msg, userId)
      ]);

      order.isActive = false;
      orderStatus.isActive = false;

      await Promise.all([order.save(), orderStatus.save()]);

      this.notifyListeners(orderId, 'cancelled', msg);

      return { success: true };

    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}

// ---------------- BACKGROUND PROCESSOR ----------------
let intervalId;

const startStatusProcessor = () => {
  if (intervalId) return; // prevent duplicate

  intervalId = setInterval(() => {
    OrderStatusService.processPendingStatusUpdates().catch(console.error);
  }, 1000);

  console.log('✅ Status processor running...');
};

const stopStatusProcessor = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

module.exports = {
  OrderStatusService,
  startStatusProcessor,
  stopStatusProcessor
};