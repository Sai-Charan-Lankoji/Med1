const express = require("express");
const {
  createPlan,
  getPlanById,
  listPlans,
  updatePlan,
  deletePlan,
} = require("../controllers/plan.controller");

const router = express.Router();

/**
 * @swagger
 * /api/plan:
 *   post:
 *     summary: Create a new plan
 *     tags: [Plans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plan'
 *     responses:
 *       201:
 *         description: Plan created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/plan", createPlan); // Create a new plan

/**
 * @swagger
 * /api/plan/{id}:
 *   get:
 *     summary: Get a plan by ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plan not found
 */
router.get("/plan/:id", getPlanById); // Get a plan by ID

/**
 * @swagger
 * /api/plan:
 *   get:
 *     summary: List all plans
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: List of all plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plan'
 */
router.get("/plan", listPlans); // List all plans

/**
 * @swagger
 * /api/plan/{id}:
 *   put:
 *     summary: Update a plan by ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plan'
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *       404:
 *         description: Plan not found
 */
router.put("/plan/:id", updatePlan); // Update a plan by ID

/**
 * @swagger
 * /api/plan/{id}:
 *   delete:
 *     summary: Delete a plan by ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *       404:
 *         description: Plan not found
 */
router.delete("/plan/:id", deletePlan); // Delete a plan by ID

module.exports = router;
