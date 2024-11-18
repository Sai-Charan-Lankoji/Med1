const express = require("express");
const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Store state management
let lastUsedPort = 8002;
let lastStoreNumber = 0;
const STORES_FILE = path.join(__dirname, "stores.json");
let storeRegistry = [];

async function initializeStoreRegistry() {
  try {
    const data = await fs.readFile(STORES_FILE, "utf8");
    storeRegistry = JSON.parse(data);
    storeRegistry.forEach((store) => {
      lastStoreNumber = Math.max(
        lastStoreNumber,
        parseInt(store.directoryName.replace("store", ""))
      );
      lastUsedPort = Math.max(lastUsedPort, store.port);
    });
    console.log("Store registry loaded:", storeRegistry);
  } catch (error) {
    console.log("No existing stores file found, starting fresh");
    storeRegistry = [];
  }
}

async function saveStoreRegistry() {
  await fs.writeFile(STORES_FILE, JSON.stringify(storeRegistry, null, 2));
}

async function createStore(storeDetails) {
  lastStoreNumber++;
  lastUsedPort++;
  const newStoreName = `store${lastStoreNumber}`;
  const sourcePath = path.join(__dirname, "apps", "store-template");
  const targetPath = path.join(__dirname, "apps", newStoreName);

  try {
    await fs.mkdir(targetPath, { recursive: true });
    await fs.cp(sourcePath, targetPath, { recursive: true });

    // Update package.json
    const packageJsonPath = path.join(targetPath, "package.json");
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
    packageJson.name = newStoreName;
    packageJson.scripts.dev = `next dev -p ${lastUsedPort}`;
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Update constants.ts
    const constantsPath = path.join(targetPath, "constants", "constants.ts");
    const constantsContent = `
export const NEXT_PUBLIC_API_URL = "http://localhost:9000"
export const NEXT_PUBLIC_API_KEY = "pk_01J9JQNA1HVN8XRFV8PGNAJHP0"
export const NEXT_PUBLIC_VENDOR_ID = "${storeDetails.vendor_id}"
export const NEXT_STORE_NAME = "${storeDetails.name}"
export const NEXT_PUBLIC_STORE_ID = "${storeDetails.id}"
export const NEXT_PUBLIC_SALES_CHANNEL_ID = "${storeDetails.default_sales_channel_id}"
export const NEXT_PUBLIC_CURRENCY_CODE = "${storeDetails.default_currency_code}"
    `;
    await fs.writeFile(constantsPath, constantsContent);

    return {
      directoryName: newStoreName,
      storeName: storeDetails.name,
      vendorId: storeDetails.vendor_id,
      storeId: storeDetails.id,
      salesChannelId: storeDetails.default_sales_channel_id,
      currencyCode: storeDetails.default_currency_code,
      port: lastUsedPort,
      url: `http://localhost:${lastUsedPort}`,
      dashboardUrl: `http://localhost:${lastUsedPort}/dashboard`,
    };
  } catch (error) {
    console.error("Error creating store:", error);
    throw error;
  }
}

async function startStore(directoryName, port) {
  return new Promise((resolve, reject) => {
    const terminal = exec(
      `cd apps/${directoryName} && npm install && npm run dev`,
      {
        cwd: __dirname,
      }
    );

    terminal.stdout.on("data", (data) => {
      console.log(`[${directoryName}] ${data}`);
      if (data.includes(`http://localhost:${port}`)) {
        console.log(`${directoryName} is running on port ${port}`);
        resolve(true);
      }
    });

    terminal.stderr.on("data", (data) => {
      console.error(`[${directoryName}] Error:`, data);
    });

    terminal.on("error", (error) => {
      console.error(`Error starting ${directoryName}:`, error);
      reject(error);
    });

    terminal.on("close", (code) => {
      if (code !== 0) {
        console.error(`${directoryName} process exited with code ${code}`);
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}

async function startExistingStores() {
  for (const store of storeRegistry) {
    try {
      await startStore(store.directoryName, store.port);
    } catch (error) {
      console.error(`Failed to start store ${store.directoryName}:`, error);
    }
  }
}

app.post("/create-store", async (req, res) => {
  console.log("Received create-store request:", req.body);
  const storeDetails = req.body;

  try {
    const storeInfo = await createStore(storeDetails);
    storeRegistry.push(storeInfo);
    await saveStoreRegistry();

    await startStore(storeInfo.directoryName, storeInfo.port);

    res.json({
      success: true,
      message: "Store created successfully",
      storeInfo: storeInfo,
    });
  } catch (error) {
    console.error("Error creating or starting store:", error);
    res.status(500).json({
      success: false,
      message: "Error creating or starting store",
      error: error.message,
    });
  }
});

app.get("/stores", (req, res) => {
  res.json(storeRegistry);
});

app.get("/health", async (req, res) => {
  const healthStatus = await checkAllStoresHealth();
  const overallHealth = Object.values(healthStatus).every(
    (status) => status === "healthy"
  );
  res.json({
    overallHealth: overallHealth ? "healthy" : "unhealthy",
    stores: healthStatus,
  });
});

async function checkAllStoresHealth() {
  const status = {};
  for (const store of storeRegistry) {
    try {
      const response = await fetch(
        `http://localhost:${store.port}/api/health`,
        {
          timeout: 5000, // 5 seconds timeout
        }
      );
      if (response.ok) {
        const data = await response.json();
        status[store.directoryName] =
          data.status === "ok" ? "healthy" : "unhealthy";
      } else {
        status[store.directoryName] = "unhealthy";
      }
    } catch (error) {
      console.error(`Health check failed for ${store.directoryName}:`, error);
      status[store.directoryName] = "unreachable";
    }
  }
  return status;
}

async function startServer() {
  await initializeStoreRegistry();
  await startExistingStores();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Store creation server running on http://localhost:${PORT}`);
    console.log("Active stores:", storeRegistry.length);
  });
}

startServer();

console.log("Server script loaded");
