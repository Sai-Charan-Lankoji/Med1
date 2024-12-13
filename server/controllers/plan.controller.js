const planService = require("../services/plan.service");

// Create a new plan
const createPlan = async (req, res) => {
  try {
    const plan = await planService.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    console.error("Error in createPlan:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get a specific plan by ID
const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await planService.getPlanById(id);
    res.status(200).json(plan);
  } catch (error) {
    console.error("Error in getPlanById:", error.message);
    res.status(404).json({ error: error.message });
  }
};

// Get all plans
const listPlans = async (req, res) => {
  try {
    const plans = await planService.list();
    res.status(200).json(plans);
  } catch (error) {
    console.error("Error in listPlans:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update an existing plan
const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPlan = await planService.update(id, req.body);
    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("Error in updatePlan:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Delete a plan
const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    await planService.delete(id);
    res.status(204).send({message: "Successfully deleted plan."}); 
  } catch (error) {
    console.error("Error in deletePlan:", error.message);
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  createPlan,
  getPlanById,
  listPlans,
  updatePlan,
  deletePlan,
};
