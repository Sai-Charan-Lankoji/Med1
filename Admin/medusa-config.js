const dotenv = require("dotenv");

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

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS ||
  "http://localhost:7000,http://localhost:7001";
//https://samadmin-two.vercel.app
// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS =
  process.env.STORE_CORS || "http://localhost:8004,http://localhost:8003";

const VENDOR_CORS = process.env.VENDOR_CORS || "http://localhost:8009";

const UPLOADS_CORS = process.env.UPLOADS_CORS || "http://localhost:8003";

// Comment out the old DATABASE_URL
const DATABASE_URL = process.env.DATABASE_URL || "postgres://default:tqfuhs07uyxe@ep-muddy-dew-a1j7hwiv.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require";

/*DigitalOcean setup: New database connection configuration
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DATABASE = process.env.DB_DATABASE;

// DigitalOcean setup: Construct DATABASE_URL
const DATABASE_URL =
  `postgres://${DB_USERNAME}:${DB_PASSWORD}` +
  `@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;  */

const POSTGRES_SCHEMA = process.env.POSTGRES_SCHEMA;

//const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

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
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      serve: process.env.NODE_ENV === "development", //ensures that admin only works in development mode
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
];

const modules = {
  // Uncomment the following lines to enable Redis
  /*
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  */
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwt_secret: process.env.JWT_SECRET,
  cookie_secret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  vendor_cors: VENDOR_CORS,
  uploads_cors: UPLOADS_CORS,
  schema: POSTGRES_SCHEMA,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Uncomment the following line to enable Redis
  // redis_url: REDIS_URl
  
  
  database_extra: {
    entityPrefix: "",
    migrations: ["dist/migrations/*.js"],
    entities: ["dist/models/*.js"],
    // DigitalOcean setup: SSL configuration for all environments
    ssl: { rejectUnauthorized: false },
  },
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
