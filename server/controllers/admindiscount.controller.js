const DiscountService = require("../services/admindiscount.service");

class DiscountController {
  // Get the current discount settings
  async getDiscount(req, res, next) {
    try {
      const discount = await DiscountService.getDiscount();
      res.status(200).json(discount);
    } catch (error) {
      next(error);
    }
  }

  // Update discount settings
  async updateDiscount(req, res, next) {
    try {
      const updatedDiscount = await DiscountService.updateDiscount(req.body);
      res.status(200).json(updatedDiscount);
    } catch (error) {
      next(error);
    }
  }

  // Create new discount settings
  async createDiscount(req, res, next) {
    try {
      const newDiscount = await DiscountService.createDiscount(req.body);
      res.status(201).json(newDiscount);
    } catch (error) {
      next(error);
    }
  }

  // Delete discount settings
  async deleteDiscount(req, res, next) {
    const { id } = req.params;
    try {
      await DiscountService.deleteDiscount(id);
      res.status(204).send(); // No content to return, just success status
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DiscountController();