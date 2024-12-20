const Store = require("../models/store.model");
const crypto = require("crypto");
const sequelize = require("../config/db");
const vercelToken = process.env.VERCEL_TOKEN;

const vercelProjectId = process.env.VERCEL_PROJECT_ID;

const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};
class StoreService {
  async createStore(storeData) {
    if (!storeData.vendor_id) {
      throw new Error("Vendor ID is required to create a store.");
    }

    const storeId = generateEntityId("store");
    const store = await Store.create({ id: storeId, ...storeData });
    return store;
  }

  async retrieveById(storeId) {
    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new Error("Store not found.");
    }
    return store;
  }

  async updateStore(storeId, updateData) {
    const store = await this.retrieveById(storeId);
    return await store.update(updateData);
  }

  async deleteStore(storeId) {
    const store = await this.retrieveById(storeId);
    await store.destroy({ force: true });
    return { message: "Store deleted successfully." };
  }

  async listStoresByVendor(vendorId) {
    return await Store.findAll({ where: { vendor_id: vendorId } });
  }

  async listStores() {
    return await Store.findAll();
  }

  async addDomainToVercel(storeName) {
    // Validate required environment variables
    if (!vercelToken || !vercelProjectId) {
      console.error("Missing required environment variables");
      process.exit(1);
    }
    try {
      const domain = `${storeName
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")}-vendorhub.vercel.app`;

      const response = await fetch(
        `https://api.vercel.com/v9/projects/${vercelProjectId}/domains`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${vercelToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: domain,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add domain");
      }

      return domain;
    } catch (error) {
      console.error("Error adding domain to Vercel:", error);
      throw error;
    }
  }

  async getStoreByURL(storeUrl) {
    try {
      const store = await Store.findOne({
        where:{ store_url: storeUrl }
      });

      if (!store) {
        throw new Error("Store not found");
      }
      return store;
    } catch (error) {
      throw new Error(`Error finding store: ${error.message}`);
    }
  }
}

module.exports = new StoreService();
