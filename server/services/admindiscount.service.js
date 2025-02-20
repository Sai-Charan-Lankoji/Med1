const AdminDiscount = require("../models/admindiscount.model");

class DiscountService {
  // Retrieve discount settings
  async getDiscount() {
    return await AdminDiscount.findOne();
  }

  // Create or Update discount settings
  async updateDiscount(data) {
    let discount = await AdminDiscount.findOne();
    if (!discount) {
      return await AdminDiscount.create(data);
    } else {
      return await discount.update(data);
    }
  }

  // Create new discount settings or update if exists
  async createDiscount(data) {
    // Check if a discount already exists
    const existingDiscount = await AdminDiscount.findOne();
    if (existingDiscount) {
      // If exists, call updateDiscount instead of throwing error
      return await this.updateDiscount(data);
    }
    // If no existing discount, create new
    return await AdminDiscount.create(data);
  }

  // Delete discount settings
  async deleteDiscount(id) {
    return await AdminDiscount.destroy({ where: { id } });
  }
}

module.exports = new DiscountService();
