const dotenv = require("dotenv");
const bodyParser = require("body-parser");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

const generatePortString = (start, end) => {
  const ports = [];
  for (let i = start; i <= end; i++) {
    ports.push(`http://localhost:${i}`);
  }
  return ports.join(',');
};

const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7009,http://localhost:7001";
const STORE_CORS = process.env.STORE_CORS || generatePortString(8000, 80100);
const VENDOR_CORS = process.env.VENDOR_CORS || "http://localhost:7009,http://localhost:7000"; 
// const tEST_CORS = process.env.tEST_CORS ||  "http://localhost:7000"
const UPLOADS_CORS = process.env.UPLOADS_CORS || generatePortString(8000, 80100);
const DATABASE_URL = process.env.DATABASE_URL 
const POSTGRES_SCHEMA = process.env.POSTGRES_SCHEMA;

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    options: {
      autoRebuild: true,
      serve: process.env.NODE_ENV === "development",
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
];

// Updated server configuration with increased limits
const server = {
  server: {
    middleware: [
      {
        name: "body-parser",
        resolve: (rootDirectory) => {
          return (app) => {
            // Increase JSON limit to 50MB
            app.use(bodyParser.json({ limit: '50mb' }));
            
            // Increase URL-encoded limit to 50MB
            app.use(bodyParser.urlencoded({ 
              limit: '50mb', 
              extended: true,
              parameterLimit: 50000 
            }));
            
            // Add raw body parser with increased limit
            app.use(bodyParser.raw({ 
              limit: '50mb',
              type: 'application/octet-stream' 
            }));
          };
        },
      },
    ],
  },
};

const modules = {};

const projectConfig = {
  jwt_secret: process.env.JWT_SECRET,
  cookie_secret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS, 
  // tEST_cors: tEST_CORS,  // For testing purposes only. Remove in production.
  vendor_cors: VENDOR_CORS,
  uploads_cors: UPLOADS_CORS,
  schema: POSTGRES_SCHEMA,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  redis_url: null,
  database_extra: {
    entityPrefix: "",
    migrations: ["dist/migrations/*.js"],
    entities: ["dist/models/*.js"],
    ssl: { 
      rejectUnauthorized: false,
      sslmode: 'require',
     },
  },
};

module.exports = {
  projectConfig,
  plugins,
  modules,
  server
};