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
export const NEXT_PUBLIC_API_KEY = "${storeDetails.publishableapikey}"
export const NEXT_PUBLIC_VENDOR_ID = "${storeDetails.vendor_id}"
export const NEXT_STORE_NAME = "${storeDetails.name}"
export const NEXT_PUBLIC_STORE_ID = "${storeDetails.id}"
export const NEXT_PUBLIC_SALES_CHANNEL_ID = "${storeDetails.default_sales_channel_id}"
export const NEXT_PUBLIC_CURRENCY_CODE = "${storeDetails.default_currency_code}"
export const NEXT_PORT = "${lastUsedPort}"
    `;
    await fs.writeFile(constantsPath, constantsContent);

//update port.js
const portPath = path.join(targetPath, "constants", "port.js");
const portContent = `const NEXT_PORT = "${lastUsedPort}"

module.exports = {
    NEXT_PORT,
  };`;
await fs.writeFile(portPath, portContent);

  // Update next.config.mjs
//     const nextConfigPath = path.join(targetPath, "next.config.mjs");
//     const nextConfigContent = `
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//         port: '${lastUsedPort}',
//         pathname: '/uploads/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'ik.imagekit.io',
//         port: '',
//         pathname: '/zz7harqme/**',
//       },
//     ],
//   },
//   webpack: (config) => {
//     config.externals.push({
//       "utf-8-validate": "commonjs utf-8-validate",
//       bufferutil: "commonjs bufferutil",
//       canvas: "commonjs canvas",
//     });
//     return config;
//   }
// };

// export default nextConfig;
//     `;
//     await fs.writeFile(nextConfigPath, nextConfigContent);

    return {
      directoryName: newStoreName,
      storeName: storeDetails.name,
      vendorId: storeDetails.vendor_id,
      storeId: storeDetails.id,
      salesChannelId: storeDetails.default_sales_channel_id,
      currencyCode: storeDetails.default_currency_code,
      port: lastUsedPort,
      url: `http://localhost:${lastUsedPort}`,
      
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

async function findProcessId(port) {
  return new Promise((resolve, reject) => {
    const command = process.platform === 'win32'
      ? `netstat -ano | findstr :${port}`
      : `lsof -i :${port} -t`;

    exec(command, (error, stdout, stderr) => {
      if (error || !stdout.trim()) {
        resolve(null);
      } else {
        const pid = process.platform === 'win32'
          ? stdout.split('\n')[0].split(/\s+/)[5]
          : stdout.trim();
        resolve(pid || null);
      }
    });
  });
}

async function killProcess(pid) {
  return new Promise((resolve, reject) => {
    treeKill(pid, 'SIGKILL', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function retryOperation(operation, maxRetries = 10, delay = 2000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await operation();
      return;
    } catch (error) {
      console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
      if (attempt === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function shutdownStore(directoryName, port) {
  await retryOperation(async () => {
    const pid = await findProcessId(port);
    if (pid) {
      await killProcess(pid);
      // Wait longer to ensure the process has been killed and all file handles are closed
      await new Promise(resolve => setTimeout(resolve, 5000));
      // Check if the process is still running
      const pidAfterKill = await findProcessId(port);
      if (pidAfterKill) {
        throw new Error(`Failed to kill process on port ${port}`);
      }
    }
    console.log(`${directoryName} has been shut down`);
  });
}

async function forceDeleteDirectory(directoryPath) {
  await retryOperation(async () => {
    try {
      await fs.rm(directoryPath, { recursive: true, force: true });
      console.log(`Successfully deleted directory: ${directoryPath}`);
    } catch (error) {
      console.error(`Error deleting directory ${directoryPath}:`, error);
      throw error; // Rethrow the error to trigger a retry
    }
  });
}

app.delete("/delete-store/:storeId", async (req, res) => {
  const { storeId } = req.params;

  try {
    const storeIndex = storeRegistry.findIndex(store => store.storeId === storeId);
    if (storeIndex === -1) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    const store = storeRegistry[storeIndex];

    console.log(`Attempting to shut down ${store.directoryName}...`);
    await shutdownStore(store.directoryName, store.port);
    console.log(`${store.directoryName} shutdown complete.`);

    const storePath = path.join(__dirname, "apps", store.directoryName);
    
    console.log(`Waiting for directory to be safe for deletion...`);
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds

    console.log(`Attempting to forcefully delete directory...`);
    await forceDeleteDirectory(storePath);
    console.log(`Directory deletion complete.`);

    storeRegistry.splice(storeIndex, 1);
    await saveStoreRegistry();

    res.json({
      success: true,
      message: "Store deleted successfully",
      deletedStore: store,
    });
  } catch (error) {
    console.error("Error deleting store:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting store",
      error: error.message,
    });
  }
});


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
