const mongoose = require('mongoose');

// Person Details Schema
const personDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  tableNumber: {
    type: String,
    required: function() {
      return this.orderType === 'dine-in';
    }
  },
  orderType: {
    type: String,
    enum: ['dine-in', 'takeaway', 'delivery'],
    default: 'dine-in'
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  deliveryAddress: {
    type: String,
    trim: true
  }
});

// Status History Schema
const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Booking Details Schema
const bookingDetailsSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  estimatedPickupTime: {
    type: Date
  },
  preparationStatus: {
    type: String,
    enum: ['confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  currentStatus: {
    type: String,
    enum: ['confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  statusHistory: [statusHistorySchema],
  specialInstructions: {
    type: String,
    default: ''
  }
});

// Plate Recommendations Schema
const plateRecommendationsSchema = new mongoose.Schema({
  plateId: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  customizations: [{
    type: String
  }],
  specialInstructions: {
    type: String,
    default: ''
  }
});

// Order Item Schema
const orderItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  finalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  customizations: [{
    type: String
  }],
  specialInstructions: {
    type: String,
    default: ''
  },
  preparationTime: {
    type: Number,
    default: 15 // minutes
  }
});

// Order Summary Schema
const orderSummarySchema = new mongoose.Schema({
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  totalItems: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  }
});

// Metadata Schema
const metadataSchema = new mongoose.Schema({
  source: {
    type: String,
    default: 'NutriScan-AI-App'
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String
});

// Main Order Schema
const orderSchema = new mongoose.Schema({
  personDetails: {
    type: personDetailsSchema,
    required: true
  },
  bookingDetails: {
    type: bookingDetailsSchema,
    required: true
  },
  plateRecommendations: [plateRecommendationsSchema],
  orderSummary: {
    type: orderSummarySchema,
    required: true
  },
  metadata: {
    type: metadataSchema,
    default: () => ({})
  },
  status: {
    type: String,
    enum: ['confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'confirmed',
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
orderSchema.index({ 'bookingDetails.orderId': 1 });
orderSchema.index({ 'bookingDetails.bookingId': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'personDetails.tableNumber': 1 });

// Virtual for formatted order ID
orderSchema.virtual('formattedOrderId').get(function() {
  return this.bookingDetails?.orderId || this._id;
});

// Virtual for status display
orderSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };
  return statusMap[this.status] || this.status;
});

// Method to add status history entry
orderSchema.methods.addStatusHistory = async function(status, note, userId = null) {
  this.bookingDetails.statusHistory.push({
    status,
    timestamp: new Date(),
    note,
    updatedBy: userId
  });
  this.bookingDetails.currentStatus = status;
  this.status = status;
  await this.save();
};

// Method to get estimated completion time
orderSchema.methods.getEstimatedCompletionTime = function() {
  const totalPrepTime = this.orderSummary.items.reduce(
    (total, item) => total + (item.preparationTime * item.quantity),
    0
  );
  const estimatedMinutes = Math.min(totalPrepTime, 45); // Cap at 45 minutes
  return new Date(Date.now() + estimatedMinutes * 60000);
};

// Static method to generate unique IDs
orderSchema.statics.generateOrderId = function() {
  return `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

orderSchema.statics.generateBookingId = function() {
  return `BK_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
};

// Static method to find by order ID
orderSchema.statics.findByOrderId = function(orderId) {
  return this.findOne({ 'bookingDetails.orderId': orderId });
};

// Static method to find active orders
orderSchema.statics.findActiveOrders = function() {
  return this.find({ 
    status: { $in: ['confirmed', 'preparing', 'ready'] },
    isActive: true 
  }).sort({ createdAt: 1 });
};

// Pre-save middleware
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.bookingDetails.preparationStatus = this.status;
    this.bookingDetails.currentStatus = this.status;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;