const publishableApiKeyService = require('../services/publishableapikey.service');

exports.list = async (req, res) => {
  try {
    const keys = await publishableApiKeyService.list();
    res.status(200).json(keys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.retrieve = async (req, res) => {
  try {
    const { id } = req.params;
    const key = await publishableApiKeyService.retrieve(id);
    res.status(200).json(key);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const newKey = await publishableApiKeyService.create(data);
    res.status(201).json(newKey);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await publishableApiKeyService.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
