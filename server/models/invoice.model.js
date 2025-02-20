const Invoice = sequelize.define(
    "Invoice",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      vendor_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "vendor",
          key: "id",
        },
      },
      plan_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "plan",
          key: "id",
        },
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "paid", "overdue"),
        defaultValue: "pending",
      },
      billing_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "invoice",
      timestamps: true,
      hooks: {
        beforeCreate: (invoice) => {
          invoice.id = generateEntityId("invoice");
        },
      },
    }
  );
  
  Vendor.hasMany(Invoice, { foreignKey: "vendor_id", as: "invoices" });
  Invoice.belongsTo(Vendor, { foreignKey: "vendor_id", as: "vendor" });
  module.exports = Invoice;