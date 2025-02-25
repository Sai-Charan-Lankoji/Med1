require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/db.js");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpecs } = require("./swagger/swagger");
const { listStores } = require("./services/store.service.js");
const { startBillingScheduler } = require("./schedulers/billingScheduler");
// Import routes
const vendorRoutes = require("./routes/vendor.route.js");
const authRoutes = require("./routes/auth.route.js");
const planRoutes = require("./routes/plan.route.js");
const orderRoutes = require("./routes/order.route.js");
const vendorauthRoutes = require("./routes/vendorauth.route.js");
const ProductRoutes = require("./routes/product.route.js");
const CustomerRoutes = require("./routes/customer.route.js");
const vendoruserRoutes = require("./routes/vendoruser.route.js");
const storeRoutes = require("./routes/store.route.js");
const cartRoutes = require("./routes/cart.route.js");
const saleschannelRoutes = require("./routes/saleschannel.route.js");
const tokenBlacklistRoutes = require("./routes/tokenBlacklist.route.js");
const publishableApiKeyRoutes = require("./routes/publishableapikey.route.js");
const fileRoutes = require("./routes/file.route.js");
const standardProductRoutes = require("./routes/standardProduct.route.js");
const wishlistRoutes = require("./routes/wishlist.route.js");
const revenueRoutes = require("./routes/revenue.js");
const admindiscountRouters = require("./routes/admindiscount.route.js");
const supplierRoutes = require("./routes/supplier.route.js");
const transporterRoutes = require("./routes/transport.route.js");
const consignmentRoutes = require("./routes/consignment.route.js");
const stockTransactionRoutes = require("./routes/stocktransaction.route.js");
const notificationRoutes = require("./routes/notification.route.js");
const app = express();

// Initialize scheduler
startBillingScheduler();

let dynamicAllowedOrigins = [];

const updateAllowedOrigins = async () => {
  try {
    const stores = await listStores();
    dynamicAllowedOrigins = stores.map((store) => store.store_url);
    // console.log("Updated Allowed Origins:", dynamicAllowedOrigins);
  } catch (error) {
    console.error("Error updating allowed origins:", error.message);
  }
};

updateAllowedOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      const predefinedOrigins = [
        "http://localhost:7009",
        "http://localhost:7000",
        "http://localhost:3000",
        "http://localhost:5000",
        "https://med1-4217.vercel.app",
        "https://med1-five.vercel.app",
        "https://med1-p6q2.vercel.app",
      ];

      const allowedOrigins = [...predefinedOrigins, ...dynamicAllowedOrigins];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "credentials"],
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      req.headers.origin || "*"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    next();
  },
  express.static(path.join(__dirname, "public/uploads"))
);

// API Documentation - Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use("/api/vendors", vendorRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", planRoutes);
app.use("/api/vendor", vendorauthRoutes);
app.use("/api", vendoruserRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/customer", CustomerRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/saleschannels", saleschannelRoutes);
app.use("/api/token-blacklist", tokenBlacklistRoutes);
app.use("/api/publishibleapikey", publishableApiKeyRoutes);
app.use("/api", fileRoutes);
app.use("/api/standardproducts", standardProductRoutes);
app.use("/api/wishlists", wishlistRoutes);
app.use("/api", revenueRoutes);
app.use("/api/admin", admindiscountRouters);
app.use("/api/suppliers", supplierRoutes);
app.use("/transporters", transporterRoutes);
app.use("/consignments", consignmentRoutes);
app.use("/stock-transactions", stockTransactionRoutes);
app.use("/api/notifications", notificationRoutes);
// Periodically refresh the allowed origins
setInterval(updateAllowedOrigins, 60000);

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

startServer();