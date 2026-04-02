const fs = require("fs");
const pdf = require("pdf-parse");
const Order = require("../models/Order");

exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    const text = data.text;

    const lines = text.split("\n");

    const supplierIndex = lines.findIndex(line =>
      line.toLowerCase().includes("supplier reference")
    );
    const supplier =
      supplierIndex !== -1 && lines[supplierIndex + 1]
        ? lines[supplierIndex + 1].trim()
        : "-";

    const buyer = text.match(/Buyer Name\s*(.*)/)?.[1]?.trim() || "-";

    const po = text.match(/Purchase Order No\s*(\d+)/)?.[1] || "-";

    const quantity =
      Number(text.match(/TOTAL UNITS\s*(\d+)/)?.[1]) || 0;

    const totalAmount =
      Number(text.match(/TOTAL GROSS\s*(\d+\.?\d*)/)?.[1]) || 0;

    const deliveryDate =
      text.match(/Delivery Date\s*(\d+\/\d+\/\d+)/)?.[1] || "-";

    const exFactoryDate =
      text.match(/Ex-Factory Date\s*(\d+\/\d+\/\d+)/)?.[1] || deliveryDate;

    let category = text.match(/Category[:\s]*([^\n]+)/)?.[1]?.trim();

    if (!category) {
      const index = lines.findIndex(line =>
        line.toLowerCase().includes("category")
      );
      if (index !== -1 && lines[index + 1]) {
        category = lines[index + 1].trim();
      }
    }

    category = category || "Garment"; 

    const existing = await Order.findOne({
      styleNumber: po,
      buyer,
    });

    if (existing) {
      fs.unlinkSync(req.file.path); 
      return res.status(400).json({ message: "Order already exists" });
    }

    const order = new Order({
      supplier,
      brand: "boohoo",
      buyer,
      styleNumber: po,
      quantity,
      price: quantity ? Number((totalAmount / quantity).toFixed(2)) : 0,
      totalAmount,
      deliveryDate,
      exFactoryDate,
      category,
    });

    await order.save();
    fs.unlinkSync(req.file.path);

    res.json({ message: "PDF processed and saved", order });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};