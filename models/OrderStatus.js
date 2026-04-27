const mongoose = require('mongoose');

// Order Status Tracking Schema for real-time updates
const orderStatusSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  bookingId: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'confirmed',
    required: true
  },
  previousStatus: {
    type: String,
    enum: ['confirmed', 'preparing', 'ready', 'completed', 'cancelled']
  },
  statusMessage: {
    type: String,
    default: ''
  },
  estimatedTimeRemaining: {
    type: Number, // in minutes
    default: 0
  },
  statusUpdateCount: {
    type: Number,
    default: 0
  },
  lastStatusChangeAt: {
    type: Date,
    default: Date.now
  },
  statusHistory: [{
    status: String,
    timestamp: Date,
    message: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  activeTimeouts: {
    preparingTimeout: {
      scheduledAt: Date,
      executedAt: Date,
      isExecuted: { type: Boolean, default: false }
    },
    readyTimeout: {
      scheduledAt: Date,
      executedAt: Date,
      isExecuted: { type: Boolean, default: false }
    },
    completedTimeout: {
      scheduledAt: Date,
      executedAt: Date,
      isExecuted: { type: Boolean, default: false }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
orderStatusSchema.index({ status: 1 });
orderStatusSchema.index({ updatedAt: -1 });
orderStatusSchema.index({ 'activeTimeouts.preparingTimeout.isExecuted': 1 });
orderStatusSchema.index({ 'activeTimeouts.readyTimeout.isExecuted': 1 });
orderStatusSchema.index({ 'activeTimeouts.completedTimeout.isExecuted': 1 });

// Virtual for time elapsed since last update
orderStatusSchema.virtual('timeSinceLastUpdate').get(function() {
  return Date.now() - this.lastStatusChangeAt;
});

// Virtual for status color (for frontend)
orderStatusSchema.virtual('statusColor').get(function() {
  const colors = {
    confirmed: '#fbbf24', // amber
    preparing: '#3b82f6', // blue
    ready: '#10b981', // green
    completed: '#6b7280', // gray
    cancelled: '#ef4444' // red
  };
  return colors[this.status] || '#6b7280';
});

// Method to add status change
orderStatusSchema.methods.addStatusChange = async function(newStatus, message, userId = null) {
  this.previousStatus = this.status;
  this.status = newStatus;
  this.statusMessage = message || this.getStatusMessage(newStatus);
  this.statusUpdateCount += 1;
  this.lastStatusChangeAt = new Date();
  
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    message: this.statusMessage,
    changedBy: userId
  });
  
  await this.save();
};

// Method to get status message
orderStatusSchema.methods.getStatusMessage = function(status) {
  const messages = {
    confirmed: 'Order confirmed and waiting for kitchen',
    preparing: 'Kitchen is preparing your order!',
    ready: 'Your order is ready for pickup!',
    completed: 'Order completed! Enjoy your meal!',
    cancelled: 'Order has been cancelled'
  };
  return messages[status] || 'Status updated';
};

// Method to schedule timeout
orderStatusSchema.methods.scheduleStatusUpdate = async function(timeoutType, scheduledTime) {
  if (!this.activeTimeouts[timeoutType]) {
    this.activeTimeouts[timeoutType] = {};
  }
  this.activeTimeouts[timeoutType].scheduledAt = scheduledTime;
  this.activeTimeouts[timeoutType].isExecuted = false;
  await this.save();
};

// Method to mark timeout as executed
orderStatusSchema.methods.markTimeoutExecuted = async function(timeoutType) {
  if (this.activeTimeouts[timeoutType]) {
    this.activeTimeouts[timeoutType].executedAt = new Date();
    this.activeTimeouts[timeoutType].isExecuted = true;
    await this.save();
  }
};

// Static method to find pending status updates
orderStatusSchema.statics.findPendingTimeouts = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    status: { $nin: ['completed', 'cancelled'] },
    $or: [
      { 'activeTimeouts.preparingTimeout.isExecuted': false, 'activeTimeouts.preparingTimeout.scheduledAt': { $lte: now } },
      { 'activeTimeouts.readyTimeout.isExecuted': false, 'activeTimeouts.readyTimeout.scheduledAt': { $lte: now } },
      { 'activeTimeouts.completedTimeout.isExecuted': false, 'activeTimeouts.completedTimeout.scheduledAt': { $lte: now } }
    ]
  });
};

const OrderStatus = mongoose.model('OrderStatus', orderStatusSchema);

module.exports = OrderStatus;