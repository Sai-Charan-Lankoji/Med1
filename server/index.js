require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./config/db.js");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpecs } = require("./swagger/swagger");
const { listStores } = require("./services/store.service.js");
const { startBillingScheduler } = require("./schedulers/billingScheduler");
const notificationService = require("./services/notification.service.js");
const demoRequestService = require('./services/demo.service.js');
const defineRelationships = require("./models/relationship.model.js");
const cookieParser = require("cookie-parser");
const fileRoutes = require("./routes/file.route.js");
const demoRequestRoutes = require('./routes/demo.route.js');
// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // Temporary wildcard; actual origins handled by app CORS
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  },
});

// Predefined origins based on environment
const predefinedOrigins = process.env.NODE_ENV === "production"
  ? [
      "https://med1-4217.vercel.app",
      "https://med1-five.vercel.app",
      "https://med1-p6q2.vercel.app",
      "https://med1-wyou.onrender.com",
    ]
  : [
      "http://localhost:7009",
      "http://localhost:8000",
      "http://localhost:7008",
      "http://localhost:7000",
      "http://localhost:3000",
      "http://localhost:5000",
      "https://med1-4217.vercel.app",
      "https://med1-five.vercel.app",
      "https://med1-p6q2.vercel.app",
      "https://med1-wyou.onrender.com",
    ];

// Global Set for allowed origins, initialized with predefined origins
let allowedOrigins = new Set(predefinedOrigins);

// Function to update allowed origins
const updateAllowedOrigins = async () => {
  try {
    const stores = await listStores();
    const dynamicOrigins = stores.map((store) => store.store_url);
    allowedOrigins = new Set([...predefinedOrigins, ...dynamicOrigins]);
  } catch (error) {
    console.error("Error updating allowed origins:", error.message);
    // Keep the previous allowedOrigins if update fails
  }
};

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, origin);
    } else {
      console.log(`CORS rejected origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  exposedHeaders: ["Set-Cookie"],
};

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("joinVendorRoom", (vendorId) => {
    socket.join(`vendor_${vendorId}`);
    console.log(`Client ${socket.id} joined room: vendor_${vendorId}`);
  });
  socket.on("joinAdminRoom", () => {
    socket.join("admin_room");
    console.log(`Client ${socket.id} joined admin room`);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Server setup function
const startServer = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log("Database connected!");
    await sequelize.sync({ force: false });
    console.log("Models synced!");
    defineRelationships();
    console.log("Relationships defined!");

    // Initialize services
    startBillingScheduler();
    notificationService.setSocketIo(io);
    
    demoRequestService.setSocketIo(io);

    // Ensure allowed origins are populated before starting
    await updateAllowedOrigins();

    // Middleware
    app.use(cookieParser());
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    app.use(cors(corsOptions));
    app.options("*", cors(corsOptions));

    // Static file serving for uploads
    app.use(
      "/uploads",
      (req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
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

    // Swagger API documentation
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

    // Routes
    app.use("/api/address", require("./routes/customeraddreess.route.js"));
    app.use('/api', fileRoutes);
    app.use("/api/vendors", require("./routes/vendor.route.js"));
    app.use("/api/orders", require("./routes/order.route.js"));
    app.use("/api/auth", require("./routes/adminRoutes/auth.route.js"));
    app.use("/api", require("./routes/plan.route.js"));
    app.use("/api/vendor", require("./routes/vendorauth.route.js"));
    app.use("/api", require("./routes/vendoruser.route.js"));
    app.use("/api/products", require("./routes/product.route.js"));
    app.use("/api/customer", require("./routes/customer.route.js"));
    app.use("/api/stores", require("./routes/store.route.js"));
    app.use("/api/carts", require("./routes/cart.route.js"));
    app.use("/api/saleschannels", require("./routes/saleschannel.route.js"));
    app.use("/api/token-blacklist", require("./routes/tokenBlacklist.route.js"));
    app.use("/api/publishibleapikey", require("./routes/publishableapikey.route.js"));
    app.use("/api", require("./routes/file.route.js"));
    app.use("/api/standardproducts", require("./routes/standardProduct.route.js"));
    app.use("/api/wishlists", require("./routes/wishlist.route.js"));
    app.use("/api", require("./routes/revenue.route.js"));
    app.use("/api/admin", require("./routes/admindiscount.route.js"));
    app.use("/api/suppliers", require("./routes/supplier.route.js"));
    app.use("/consignments", require("./routes/consignment.route.js"));
    app.use("/stock-transactions", require("./routes/stocktransaction.route.js"));
    app.use("/api/stock", require("./routes/stock.route.js"));
    app.use("/api/notifications", require("./routes/notification.route.js"));
    app.use("/api/transporters", require("./routes/transport.route.js"));
    app.use('/api/demo-requests', demoRequestRoutes);

    // Periodic update of allowed origins
    setInterval(updateAllowedOrigins, 60000);

    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1); // Exit with failure code if server cannot start
  }
};

// Start the server
startServer();