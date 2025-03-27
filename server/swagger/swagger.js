const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "ADMIN API Documentation",
      version: "1.0.0",
      description: "API documentation for Admin",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
      {
        url: process.env.RENDER_EXTERNAL_URL || "https://med1-wyou.onrender.com/",
        description: "Production server"
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js","./routes/*/*.js"],
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerSpecs,
};