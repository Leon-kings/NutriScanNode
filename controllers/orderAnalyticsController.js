const Order = require("../models/Order");

/* =====================================================
   DAILY REPORT
===================================================== */
exports.getDailyReport = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },

      { $unwind: "$items" },

      {
        $group: {
          _id: "$items.name",
          totalQty: { $sum: "$items.quantity" },
          income: {
            $sum: {
              $multiply: ["$items.finalPrice", "$items.quantity"],
            },
          },
        },
      },

      { $sort: { totalQty: -1 } },
    ]);

    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    let totalIncome = 0;

    const topPlates = result.map((r) => {
      totalIncome += r.income;
      return {
        name: r._id,
        quantity: r.totalQty,
      };
    });

    return res.json({
      success: true,
      period: "daily",
      totalOrders,
      totalIncome,
      topPlates,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   WEEKLY REPORT
===================================================== */
exports.getWeeklyReport = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - 7);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: now },
        },
      },

      { $unwind: "$items" },

      {
        $group: {
          _id: "$items.name",
          totalQty: { $sum: "$items.quantity" },
          income: {
            $sum: {
              $multiply: ["$items.finalPrice", "$items.quantity"],
            },
          },
        },
      },

      { $sort: { totalQty: -1 } },
    ]);

    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: start, $lte: now },
    });

    let totalIncome = 0;

    const mostOrdered = result.slice(0, 5).map((r) => {
      totalIncome += r.income;
      return {
        name: r._id,
        quantity: r.totalQty,
      };
    });

    const leastOrdered = result
      .slice(-5)
      .map((r) => ({
        name: r._id,
        quantity: r.totalQty,
      }));

    return res.json({
      success: true,
      period: "weekly",
      totalOrders,
      totalIncome,
      mostOrderedPlates: mostOrdered,
      leastOrderedPlates: leastOrdered,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   GLOBAL TOP PLATES
===================================================== */
exports.getTopPlates = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalQty: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalQty: -1 } },
    ]);

    return res.json({
      success: true,
      data: result.map((r) => ({
        name: r._id,
        quantity: r.totalQty,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   LEAST ORDERED PLATES
===================================================== */
exports.getLeastPlates = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalQty: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalQty: 1 } },
    ]);

    return res.json({
      success: true,
      data: result.map((r) => ({
        name: r._id,
        quantity: r.totalQty,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};