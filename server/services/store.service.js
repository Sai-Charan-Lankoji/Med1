const Store = require('../models/store.model');
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};
class StoreService {
  async createStore(storeData) {
    if (!storeData.vendor_id) {
      throw new Error('Vendor ID is required to create a store.');
    }

    const storeId = generateEntityId("store");
    const store = await Store.create({id: storeId, ...storeData});
    return store;
  }

  async retrieveById(storeId) {
    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new Error('Store not found.');
    }
    return store;
  }

  async updateStore(storeId, updateData) {
    const store = await this.retrieveById(storeId);
    return await store.update(updateData);
  }

  async deleteStore(storeId) {
    const store = await this.retrieveById(storeId);
    await store.destroy();
    return { message: 'Store deleted successfully.' };
  }

  async listStoresByVendor(vendorId) {
    return await Store.findAll({ where: {vendor_id: vendorId} });
  }

  async listStores(){
    return await Store.findAll();
  }
}

module.exports = new StoreService();
