const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  supplier: { type: String, default: "-" },
  brand: { type: String, default: "-" },
  buyer: { type: String, default: "-" },
  category: { type: String, default: "-" }, 
  styleNumber: { type: String, default: "-" },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  deliveryDate: { type: String, default: "-" },
  exFactoryDate: { type: String, default: "-" }, 
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);