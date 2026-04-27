const { OrderStatusService } = require('../services/orderStatusService');
const Order = require('../models/Order');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Public
 */
const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    
    // Validate required fields
    if (!orderData.customerName) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required'
      });
    }
    
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required'
      });
    }
    
    const result = await OrderStatusService.sendOrderToDatabase(orderData);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        data: {
          orderId: result.orderId,
          bookingId: result.bookingId,
          estimatedPickupTime: result.estimatedPickupTime
        },
        message: result.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
    
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

/**
 * @desc    Get order status
 * @route   GET /api/orders/:orderId/status
 * @access  Public
 */
const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }
    
    const result = await OrderStatusService.getOrderStatus(orderId);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: {
          orderId: result.orderId,
          bookingId: result.bookingId,
          status: result.status,
          statusMessage: result.statusMessage,
          estimatedTimeRemaining: result.estimatedTimeRemaining,
          orderSummary: result.orderSummary,
          personDetails: result.personDetails,
          estimatedPickupTime: result.estimatedPickupTime,
          statusHistory: result.statusHistory
        },
        message: result.message
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.message
      });
    }
    
  } catch (error) {
    console.error('Get order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order status',
      error: error.message
    });
  }
};

/**
 * @desc    Update order status (manual)
 * @route   PUT /api/orders/:orderId/status
 * @access  Private (Manager/Chef only)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, message } = req.body;
    
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and status are required'
      });
    }
    
    const validStatuses = ['confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const result = await OrderStatusService.updateOrderStatus(
      orderId, 
      status, 
      message, 
      req.user?._id
    );
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: {
          orderId: result.orderId,
          status: result.status,
          message: result.message
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
    
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

/**
 * @desc    Get all active orders (Kitchen Dashboard)
 * @route   GET /api/orders/active
 * @access  Private (Chef/Manager)
 */
const getActiveOrders = async (req, res) => {
  try {
    const result = await OrderStatusService.getActiveOrders();
    
    res.status(200).json({
      success: true,
      data: {
        count: result.count,
        orders: result.orders
      }
    });
    
  } catch (error) {
    console.error('Get active orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get active orders',
      error: error.message
    });
  }
};

/**
 * @desc    Cancel order
 * @route   POST /api/orders/:orderId/cancel
 * @access  Public (with verification)
 */
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }
    
    const result = await OrderStatusService.cancelOrder(
      orderId, 
      reason, 
      req.user?._id
    );
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: { orderId: result.orderId }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
    
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

/**
 * @desc    Get order by ID (full details)
 * @route   GET /api/orders/:orderId
 * @access  Private (Manager/Chef)
 */
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findByOrderId(orderId)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
    
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order',
      error: error.message
    });
  }
};

/**
 * @desc    Get all orders (with pagination and filtering)
 * @route   GET /api/orders
 * @access  Private (Manager only)
 */
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name email'),
      Order.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
    
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrderStatus,
  updateOrderStatus,
  getActiveOrders,
  cancelOrder,
  getOrderById,
  getAllOrders
};