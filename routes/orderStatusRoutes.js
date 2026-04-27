
const express = require('express');
const router = express.Router();
const { OrderStatusService } = require('../services/orderStatusService');

/**
 * @desc    Server-Sent Events endpoint for real-time status updates
 * @route   GET /api/order-status/events
 * @access  Public
 */
router.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

  const listenerId =
    Date.now().toString() + Math.random().toString(36).substring(2);

  // Add listener safely
  const removeListener = OrderStatusService.addStatusListener(
    listenerId,
    (notification) => {
      try {
        res.write(`data: ${JSON.stringify(notification)}\n\n`);
      } catch (err) {
        console.error('SSE write error:', err);
      }
    }
  );

  // 🔥 Heartbeat (prevents connection timeout)
  const heartbeat = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'heartbeat' })}\n\n`);
  }, 25000);

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    removeListener();
    res.end();
  });
});

/**
 * @desc    Get active listeners count
 * @route   GET /api/order-status/listeners/count
 */
router.get('/listeners/count', (req, res) => {
  res.json({
    success: true,
    count: OrderStatusService.getListenerCount()
  });
});

/**
 * @desc    Get status updates for a specific order (polling fallback)
 * @route   GET /api/order-status/:orderId
 */
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await OrderStatusService.getOrderStatus(orderId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message
      });
    }

    res.json({
      success: true,
      data: {
        status: result.status,
        statusMessage: result.statusMessage,
        estimatedTimeRemaining: result.estimatedTimeRemaining,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Order status error:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

module.exports = router;