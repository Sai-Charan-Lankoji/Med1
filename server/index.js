require("dotenv").config();
const express = require("express");
const http = require("http");
const sequelize = require("./config/db.js");
// const swaggerDocument = require("./swagger/swagger.json");
const { swaggerSpecs } = require("./swagger/swagger");
const vendorRoutes = require("./routes/vendor.route.js");
const swaggerUi = require("swagger-ui-express");
const authRoutes = require("./routes/auth.route.js");
const planRoutes = require("./routes/plan.route.js");
const orderRoutes = require("./routes/order.route.js");
const vendorauthRoutes = require("./routes/vendorauth.route.js") 
const ProductRoutes = require("./routes/product.route.js") 
const CustomerRoutes = require("./routes/customer.route.js")
const vendoruserRoutes = require("./routes/vendoruser.route.js");
const storeRoutes = require('./routes/store.route.js');
const cartRoutes = require("./routes/cart.route.js");
const saleschannelRoutes = require("./routes/saleschannel.route.js");
const tokenBlacklistRoutes = require("./routes/tokenBlacklist.route.js");
const publishableApiKeyRoutes = require("./routes/publishableapikey.route.js");
const bodyParser = require("body-parser");

const app = express();
const directory = process.cwd()
app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); 
const cors = require('cors')
app.use(
  cors({
    origin: ["http://localhost:7009","http://localhost:7000","http://localhost:3000","https://med1-4217.vercel.app","https://med1-five.vercel.app","https://med1-p6q2.vercel.app"] ,// Adjust based on your frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization","credentials"],
    credentials: true,
  })
);app.use(express.json());

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
// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
// Routes
app.use("/api/vendors", vendorRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth",authRoutes);
app.use("/api",planRoutes);
app.use("/api/vendor", vendorauthRoutes) 
app.use("/api", vendoruserRoutes);
app.use("/api/products" ,ProductRoutes ) 
app.use("/api/customer",CustomerRoutes)
app.use('/api/stores', storeRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/saleschannels', saleschannelRoutes)
app.use("/api/token-blacklist", tokenBlacklistRoutes);
app.use("/api/publishibleapikey", publishableApiKeyRoutes)
startServer();
