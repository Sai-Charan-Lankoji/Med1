// Modify update-store endpoint to handle potential port conflicts
// Replace the existing /update-store endpoint with the following code if adding preferredport option.
app.put("/update-store", async (req, res) => {
    const { store_id, name, preferredPort } = req.body;
  
    try {
      // Find the store in the registry
      const storeIndex = storeRegistry.findIndex(store => store.storeId === store_id);
      
      if (storeIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          message: "Store not found" 
        });
      }
  
      const store = storeRegistry[storeIndex];
      const storePath = path.join(__dirname, "apps", store.directoryName);
  
      // If a preferred port is specified, find an available port near it
      let newPort = store.port;
      if (preferredPort && preferredPort !== store.port) {
        newPort = await PortManager.findAvailablePortNear(preferredPort);
        
        // If a new port is allocated, release the old one
        if (newPort !== store.port) {
          await PortManager.releasePort(store.port);
        }
      }
  
      // Update store registry
      storeRegistry[storeIndex] = {
        ...store,
        storeName: name,
        port: newPort,
        url: `http://localhost:${newPort}`
      };
  
      // Save updated registry
      await saveStoreRegistry();
  
      // Update constants.ts file
      const constantsPath = path.join(storePath, "constants", "constants.ts");
      
      try {
        const constantsContent = await fs.readFile(constantsPath, "utf8");
        const updatedConstantsContent = constantsContent
          .replace(/export const NEXT_STORE_NAME = ".*"/, `export const NEXT_STORE_NAME = "${name}"`)
          .replace(/export const NEXT_PORT = ".*"/, `export const NEXT_PORT = "${newPort}"`);
        
        await fs.writeFile(constantsPath, updatedConstantsContent);
  
        // Update package.json to use new port
        const packageJsonPath = path.join(storePath, "package.json");
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
        packageJson.scripts.dev = `next dev -p ${newPort}`;
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
        // Update port.js
        const portPath = path.join(storePath, "constants", "port.js");
        const portContent = `const NEXT_PORT = "${newPort}"
  
  module.exports = {
      NEXT_PORT,
    };`;
        await fs.writeFile(portPath, portContent);
      } catch (fileError) {
        console.error("Error updating store configuration files:", fileError);
        // Non-fatal error, store registry is still updated
      }
  
      res.json({
        success: true,
        message: "Store updated successfully",
        updatedStore: {
          ...store,
          storeName: name,
          port: newPort,
          url: `http://localhost:${newPort}`
        }
      });
  
    } catch (error) {
      console.error("Error updating store:", error);
      res.status(500).json({
        success: false,
        message: "Error updating store",
        error: error.message
      });
    }
  });

  //..................................................//...

  const express = require("express");
const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");
const treeKill = require('tree-kill');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import modules
const PortManager = require('./portAllocator');
const StoreSynchronizer = require('./storeSynchronizer');

// Store state management
const STORES_FILE = path.join(__dirname, "stores.json");
const APPS_DIR = path.join(__dirname, "apps");
let storeRegistry = [];

// Create StoreSynchronizer instance
const storeSynchronizer = new StoreSynchronizer({
  storesFile: STORES_FILE,
  appsDir: APPS_DIR,
  PortManager: PortManager
});

async function initializeStoreRegistry() {
  try {
    // Initialize PortManager first
    await PortManager.initialize();

    // Initialize store registry
    storeRegistry = await storeSynchronizer.initialize();
    console.log("Store registry loaded:", storeRegistry);

    // Synchronize store registry with actual directory structure
    storeRegistry = await storeSynchronizer.synchronize(storeRegistry);

    // Save the synchronized registry
    await storeSynchronizer.saveRegistry(storeRegistry);
  } catch (error) {
    console.error("Error initializing store registry:", error);
  }
}

// Existing create store functionality remains the same as in the previous implementation
async function createStore(storeDetails) {
  const newPort = await PortManager.allocatePort();
  
  const sourcePath = path.join(__dirname, "apps", "store-template");
  const newStoreName = `store${storeRegistry.length + 1}`;
  const targetPath = path.join(__dirname, "apps", newStoreName);

  try {
    await fs.mkdir(targetPath, { recursive: true });
    await fs.cp(sourcePath, targetPath, { recursive: true });

    // Update package.json
    const packageJsonPath = path.join(targetPath, "package.json");
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
    packageJson.name = newStoreName;
    packageJson.scripts.dev = `next dev -p ${newPort}`;
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Update constants.ts
    const constantsPath = path.join(targetPath, "constants", "constants.ts");
    const constantsContent = `
export const NEXT_PUBLIC_API_URL = "http://localhost:9000"
export const NEXT_PUBLIC_API_KEY = "${storeDetails.publishableapikey}"
export const NEXT_PUBLIC_VENDOR_ID = "${storeDetails.vendor_id}"
export const NEXT_STORE_NAME = "${storeDetails.name}"
export const NEXT_PUBLIC_STORE_ID = "${storeDetails.id}"
export const NEXT_PUBLIC_SALES_CHANNEL_ID = "${storeDetails.default_sales_channel_id}"
export const NEXT_PUBLIC_CURRENCY_CODE = "${storeDetails.default_currency_code}"
export const NEXT_PORT = "${newPort}"
    `;
    await fs.writeFile(constantsPath, constantsContent);

    // Update port.js
    const portPath = path.join(targetPath, "constants", "port.js");
    const portContent = `const NEXT_PORT = "${newPort}"

module.exports = {
    NEXT_PORT,
  };`;
    await fs.writeFile(portPath, portContent);

    return {
      directoryName: newStoreName,
      storeName: storeDetails.name,
      vendorId: storeDetails.vendor_id,
      storeId: storeDetails.id,
      salesChannelId: storeDetails.default_sales_channel_id,
      currencyCode: storeDetails.default_currency_code,
      port: newPort,
      url: `http://localhost:${newPort}`,
    };
  } catch (error) {
    // If port allocation fails, release the port
    await PortManager.releasePort(newPort);
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

// Existing routes remain the same...
app.post("/create-store", async (req, res) => {
  console.log("Received create-store request:", req.body);
  const storeDetails = req.body;

  try {
    const storeInfo = await createStore(storeDetails);
    storeRegistry.push(storeInfo);
    await storeSynchronizer.saveRegistry(storeRegistry);

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

// Add manual sync route
app.post("/sync-stores", async (req, res) => {
  try {
    storeRegistry = await storeSynchronizer.synchronize(storeRegistry);
    await storeSynchronizer.saveRegistry(storeRegistry);
    res.json({
      success: true,
      message: "Stores synchronized successfully",
      stores: storeRegistry
    });
  } catch (error) {
    console.error("Error during manual store sync:", error);
    res.status(500).json({
      success: false,
      message: "Error synchronizing stores",
      error: error.message
    });
  }
});

// Existing routes like /stores, /health, /delete-store, /update-store remain the same...

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