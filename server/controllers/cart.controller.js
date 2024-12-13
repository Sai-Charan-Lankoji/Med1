const cartService = require('../services/cart.service');

class CartController {
  async createCart(req, res) {
    try {
      const cart = await cartService.createCart(req.body);
      res.status(201).json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCart(req, res) {
    try {
      const cart = await cartService.getCartById(req.params.id);
      res.status(200).json(cart);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateCart(req, res) {
    try {
      const cart = await cartService.updateCart(req.params.id, req.body);
      res.status(200).json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteCart(req, res) {
    try {
      await cartService.deleteCart(req.params.id);
      res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getCartsByCustomer(req, res) {
    try {
      const carts = await cartService.retrieveByCustomerId(req.params.customerId);
      res.status(200).json(carts);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async clearCustomerCart(req, res) {
    try {
      await cartService.clearCustomerCart(req.params.customerId);
      res.status(200).json({ message: 'Customer cart cleared successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new CartController();
