const ProductView = require("../models/productView.model");

exports.logProductView = async (req, res) => {
  const { product_id, vendor_id } = req.body;
  try {
    await ProductView.create({ product_id, vendor_id });
    res.status(201).send("View logged");
  } catch (error) {
    res.status(500).send(error.message);
  }
};