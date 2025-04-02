const Stock = require("../models/stock.model");
const StockVariant = require("../models/stockvariant.model");

class StockService {
  async getStockByProductId(productId) {
    const stock = await Stock.findOne({
      where: { productId },
      include: [
        {
          model: StockVariant,
          as: "StockVariants",
        },
      ],
    });

    if (!stock) return null;

    const totals = {
      totalQuantity: stock.totalQuantity,
      availableQuantity: stock.availableQuantity,
      onHoldQuantity: stock.onHoldQuantity,
      exhaustedQuantity: stock.exhaustedQuantity,
    };

    const variants = stock.StockVariants || [];
    const availableVariants = {
      sizes: [...new Set(variants.map((v) => v.size))].filter((size) =>
        variants.some((sv) => sv.size === size && sv.availableQuantity > 0)
      ),
      colors: [...new Set(variants.map((v) => v.color).filter(Boolean))].filter((color) =>
        variants.some((sv) => sv.color === color && sv.availableQuantity > 0)
      ),
    };

    return {
      ...stock.toJSON(),
      totals,
      availableVariants,
    };
  }

  async getStockVariantById(variantId) {
    try {
      const stockVariant = await StockVariant.findOne({
        where: { variantId },
        include: [{ model: require("../models/stock.model"), as: "stock" }],
      });

      if (!stockVariant) {
        throw new Error("Stock variant not found");
      }

      return stockVariant;
    } catch (error) {
      throw new Error(`Failed to fetch stock variant: ${error.message}`);
    }
  }

  async createStock({ title, category, stockType, productId, hsnCode, gstPercentage, variants, vendor_id }) {
    // Check for missing fields and collect them
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!category) missingFields.push("category");
    if (!stockType) missingFields.push("stockType");
    if (!hsnCode) missingFields.push("hsnCode");
    if (!gstPercentage) missingFields.push("gstPercentage");
    if (!variants || !Array.isArray(variants) || variants.length === 0) missingFields.push("variants (must be a non-empty array)");
    if (!vendor_id) missingFields.push("vendor_id");
    if (stockType === "Standard" && !productId) missingFields.push("productId (required for Standard stock type)");
    
    if (missingFields.length > 0) {
      throw new Error(`The following required fields are missing: ${missingFields.join(", ")}`);
    }

    // Check variant structure
    const invalidVariants = variants.filter(v => 
      !v.size || !v.hasOwnProperty('totalQuantity') || isNaN(parseInt(v.totalQuantity)) || parseInt(v.totalQuantity) <= 0
    );
    
    if (invalidVariants.length > 0) {
      throw new Error(`${invalidVariants.length} variants have invalid data. Each variant must have size and a positive totalQuantity`);
    }

    const totalQuantity = variants.reduce((sum, v) => sum + parseInt(v.totalQuantity), 0);

    const stock = await Stock.create({
      title,
      category,
      stockType,
      productId: stockType === "Standard" ? productId : null,
      hsnCode,
      gstPercentage,
      totalQuantity,
      availableQuantity: totalQuantity,
      onHoldQuantity: 0,
      exhaustedQuantity: 0,
      vendor_id,
    });

    const variantEntries = variants.map((v) => ({
      stockId: stock.stock_id,
      size: v.size,
      color: v.color || null, // Make color optional
      totalQuantity: parseInt(v.totalQuantity),
      availableQuantity: parseInt(v.totalQuantity),
      onHoldQuantity: 0,
      exhaustedQuantity: 0,
    }));

    await StockVariant.bulkCreate(variantEntries);

    return {
      ...stock.toJSON(),
      variants: variantEntries,
    };
  }

  async placeOrder(variantId, quantity) {
    const variant = await StockVariant.findByPk(variantId);
    if (!variant) throw new Error(`Variant not found: ${variantId}`);
    if (variant.availableQuantity < quantity) {
      throw new Error(`Insufficient stock for variant ${variantId}`);
    }

    const stock = await Stock.findByPk(variant.stockId);

    variant.availableQuantity -= quantity;
    variant.onHoldQuantity += quantity;
    stock.availableQuantity -= quantity;
    stock.onHoldQuantity += quantity;

    await Promise.all([variant.save(), stock.save()]);
    return variant;
  }

  async cancelOrder(variantId, quantity) {
    const variant = await StockVariant.findByPk(variantId);
    if (!variant) throw new Error("Variant not found");
    if (variant.onHoldQuantity < quantity) throw new Error("Insufficient on-hold stock");

    const stock = await Stock.findByPk(variant.stockId);

    variant.onHoldQuantity -= quantity;
    variant.availableQuantity += quantity;
    stock.onHoldQuantity -= quantity;
    stock.availableQuantity += quantity;

    await Promise.all([variant.save(), stock.save()]);
    return variant;
  }

  async fulfillOrder(variantId, quantity) {
    const variant = await StockVariant.findByPk(variantId);
    if (!variant) throw new Error("Variant not found");
    if (variant.onHoldQuantity < quantity) throw new Error("Insufficient on-hold stock");

    const stock = await Stock.findByPk(variant.stockId);

    variant.onHoldQuantity -= quantity;
    variant.exhaustedQuantity += quantity;
    variant.totalQuantity -= quantity;
    stock.onHoldQuantity -= quantity;
    stock.exhaustedQuantity += quantity;
    stock.totalQuantity -= quantity;

    await Promise.all([variant.save(), stock.save()]);
    return variant;
  }

  async restockVariant(variantId, quantity) {
    const variant = await StockVariant.findByPk(variantId);
    if (!variant) throw new Error("Variant not found");

    const stock = await Stock.findByPk(variant.stockId);

    variant.totalQuantity += quantity;
    variant.availableQuantity += quantity;
    stock.totalQuantity += quantity;
    stock.availableQuantity += quantity;

    await Promise.all([variant.save(), stock.save()]);
    return variant;
  }

  async getAllStocks() {
    const stocks = await Stock.findAll({
      include: [
        {
          model: StockVariant,
          as: "StockVariants",
        },
      ],
    });

    return stocks.map((stock) => ({
      ...stock.toJSON(),
      totals: {
        totalQuantity: stock.totalQuantity,
        availableQuantity: stock.availableQuantity,
        onHoldQuantity: stock.onHoldQuantity,
        exhaustedQuantity: stock.exhaustedQuantity,
      },
      availableVariants: {
        sizes: [...new Set(stock.StockVariants.map((v) => v.size))].filter((size) =>
          stock.StockVariants.some((sv) => sv.size === size && sv.availableQuantity > 0)
        ),
        colors: [...new Set(stock.StockVariants.map((v) => v.color).filter(Boolean))].filter((color) =>
          stock.StockVariants.some((sv) => sv.color === color && sv.availableQuantity > 0)
        ),
      },
    }));
  }

  async getStocksByVendorId(vendorId) {
    if (!vendorId) {
      throw new Error("Vendor ID is required");
    }

    const stocks = await Stock.findAll({
      where: { vendor_id: vendorId },
      include: [
        {
          model: StockVariant,
          as: "StockVariants",
        },
      ],
    });

    return stocks.map((stock) => ({
      ...stock.toJSON(),
      totals: {
        totalQuantity: stock.totalQuantity,
        availableQuantity: stock.availableQuantity,
        onHoldQuantity: stock.onHoldQuantity,
        exhaustedQuantity: stock.exhaustedQuantity,
      },
      availableVariants: {
        sizes: [...new Set(stock.StockVariants.map((v) => v.size))].filter((size) =>
          stock.StockVariants.some((sv) => sv.size === size && sv.availableQuantity > 0)
        ),
        colors: [...new Set(stock.StockVariants.map((v) => v.color).filter(Boolean))].filter((color) =>
          stock.StockVariants.some((sv) => sv.color === color && sv.availableQuantity > 0)
        ),
      },
    }));
  }

  async getAvailableStockByVendorId(vendorId) {
    if (!vendorId) {
      throw new Error("Vendor ID is required");
    }

    // Remove the colon prefix if it's still there
    if (vendorId.startsWith(':')) {
      vendorId = vendorId.substring(1);
    }

    console.log(`Service - Fetching available stocks for vendor: ${vendorId}`);
    console.log(`Query conditions: { vendor_id: ${vendorId}, productId: null }`);
    
    // Direct SQL check to debug
    try {
      const [results, metadata] = await sequelize.query(
        `SELECT COUNT(*) as count FROM stock WHERE vendor_id = '${vendorId}'`
      );
      console.log(`SQL direct query result (total stock count): ${JSON.stringify(results)}`);
      
      const [nullProductResults, nullMetadata] = await sequelize.query(
        `SELECT COUNT(*) as count FROM stock WHERE vendor_id = '${vendorId}' AND product_id IS NULL`
      );
      console.log(`SQL direct query result (null product_id count): ${JSON.stringify(nullProductResults)}`);
    } catch (err) {
      console.error(`SQL direct query error: ${err.message}`);
    }

    const stocks = await Stock.findAll({
      where: { 
        vendor_id: vendorId,
        productId: null  // Only get stocks that are not associated with products
      },
      include: [
        {
          model: StockVariant,
          as: "StockVariants",
        },
      ],
      logging: console.log // This will log the SQL query
    });

    console.log(`Service - Found ${stocks.length} stocks with null productId`);
    
    // Additional logging if no results
    if (stocks.length === 0) {
      // Check if there are any stocks at all for this vendor
      const allStocks = await Stock.findAll({
        where: { vendor_id: vendorId },
        logging: console.log
      });
      console.log(`Service - Total stocks for vendor: ${allStocks.length}`);
      
      if (allStocks.length > 0) {
        // Log each stock's productId for debugging
        allStocks.forEach((stock, i) => {
          console.log(`Stock ${i+1}: ID=${stock.stock_id}, productId=${stock.productId}, stockType=${stock.stockType}`);
        });
      } else {
        //console.log(`WARNING: No stocks found for vendor ID: ${vendorId}`);
        // Check if the vendor exists
        try {
          const [vendorResult] = await sequelize.query(
            `SELECT * FROM vendor WHERE id = '${vendorId}'`
          );
          if (vendorResult.length > 0) {
            //console.log(`Vendor exists: ${JSON.stringify(vendorResult[0])}`);
          } else {
            //console.log(`WARNING: Vendor with ID ${vendorId} does not exist in database`);
          }
        } catch (err) {
          //console.error(`SQL vendor check error: ${err.message}`);
        }
      }
    }

    return stocks.map((stock) => ({
      ...stock.toJSON(),
      totals: {
        totalQuantity: stock.totalQuantity,
        availableQuantity: stock.availableQuantity,
        onHoldQuantity: stock.onHoldQuantity,
        exhaustedQuantity: stock.exhaustedQuantity,
      },
      availableVariants: {
        sizes: [...new Set(stock.StockVariants.map((v) => v.size))].filter((size) =>
          stock.StockVariants.some((sv) => sv.size === size && sv.availableQuantity > 0)
        ),
        colors: [...new Set(stock.StockVariants.map((v) => v.color).filter(Boolean))].filter((color) =>
          stock.StockVariants.some((sv) => sv.color === color && sv.availableQuantity > 0)
        ),
      },
    }));
  }
}

module.exports = new StockService();