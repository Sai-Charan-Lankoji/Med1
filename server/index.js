require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/db.js");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpecs } = require("./swagger/swagger");
const { listStores } = require("./services/store.service.js"); // Import your service method

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

const app = express();

let dynamicAllowedOrigins = [];

// Function to update allowed origins dynamically
const updateAllowedOrigins = async () => {
  try {
    const stores = await listStores(); // Fetch store data using your service
    dynamicAllowedOrigins = stores.map((store) => store.store_url); // Extract store URLs
    // console.log("Updated Allowed Origins:", dynamicAllowedOrigins);
  } catch (error) {
    console.error("Error updating allowed origins:", error.message);
  }
};

// Call the updateAllowedOrigins function during server startup
updateAllowedOrigins();

// CORS middleware
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

// Body parser middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Serve /uploads with proper headers
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

// API Documentation
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
app.use("/api/standardproducts", standardProductRoutes)

// Periodically refresh the allowed origins (optional)
setInterval(updateAllowedOrigins, 60000); // Refresh every 60 seconds

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
