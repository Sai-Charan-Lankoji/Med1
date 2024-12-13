const { DataTypes } = require("sequelize");
const sequelize = require("../config/db")
const crypto = require("crypto");

// Utility function to generate a custom ID
const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};

const Plan = sequelize.define(
  "Plan",
  {
    id: {
      type: DataTypes.STRING, // Set as STRING since the generated IDs are strings
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    features: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    no_stores: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "plan",
    timestamps: false, // Disable automatic Sequelize timestamps
    hooks: {
      beforeCreate: (plan) => {
        // Generate custom ID before creating the record
        if (!plan.id) {
          plan.id = generateEntityId("plan");
        }
      },
    },
  }
);

module.exports = Plan;
