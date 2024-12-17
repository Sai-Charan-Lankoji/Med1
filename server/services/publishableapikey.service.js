const PublishableApiKey = require('../models/publishableapikey.model');
const crypto = require("crypto");
 

const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};
class PublishableApiKeyService {
  async list() {
    return await PublishableApiKey.findAll();
  }

  async retrieve(pkid) {
    const apiKey = await PublishableApiKey.findByPk( pkid );
    if (!apiKey) throw new Error('Publishable API Key not found');
    return apiKey;
  }

  async create(data) {
    if (!data.title) throw new Error('Title is required');
    const pkId = generateEntityId("pk");
    return await PublishableApiKey.create({id: pkId, ...data});
  }

  async delete(id) {
    const apiKey = await PublishableApiKey.findByPk(id);
    if (!apiKey) throw new Error('Publishable API Key not found');
    await apiKey.destroy();
  }
}

module.exports = new PublishableApiKeyService();
