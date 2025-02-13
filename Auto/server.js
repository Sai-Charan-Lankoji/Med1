const express = require("express");
const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");
const treeKill = require('tree-kill');
const { fetchAndWriteStores } = require('./fetchStores');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//imports
const PortManager = require('./portAllocator');
const StoreSyncManager = require('./storeSync'); 


// Store state management
const STORES_FILE = path.join(__dirname, "stores.json");
let storeRegistry = [];


const storeSyncManager = new StoreSyncManager();

async function initializeStoreRegistry() {
  
  try {
    // Initialize PortManager first
    await PortManager.initialize();

    const data = await fs.readFile(STORES_FILE, "utf8");
    storeRegistry = JSON.parse(data);
    console.log("Store registry loaded:", storeRegistry);

    // Synchronize stores after loading registry
    const syncResults = await storeSyncManager.synchronizeStores(storeRegistry);
    console.log("Store Synchronization Results:", syncResults);

    // Update registry if any changes occurred during sync
    if (syncResults.directoriesCreated.length > 0 || 
        syncResults.directoriesRemoved.length > 0) {
      await saveStoreRegistry();
    }
  } catch (error) {
    console.log("No existing stores file found or error during initialization, starting fresh");
    storeRegistry = [];
  }
}

async function saveStoreRegistry() {
  await fs.writeFile(STORES_FILE, JSON.stringify(storeRegistry, null, 2));
}

async function createStore(storeDetails) {
  const newPort = await PortManager.allocatePort();
  
  const sourcePath = path.join(__dirname, "apps", "store-template");
  const newStoreName = `store_${newPort}`;
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
      //`cd apps/${directoryName} && npm install && npm run build && npm run start`,
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
    const commands = {
      win32: [
        `netstat -ano | findstr :${port}`, // Fallback method
        `powershell "Get-NetTCPConnection -LocalPort ${port} | Select-Object -ExpandProperty OwningProcess"`
      ],
      default: `lsof -i :${port} -t`
    };

    const platformCommands = process.platform === 'win32' ? commands.win32 : [commands.default];

    const tryCommands = (cmdArray, index = 0) => {
      if (index >= cmdArray.length) {
        resolve(null);
        return;
      }

      exec(cmdArray[index], (error, stdout, stderr) => {
        if (error || !stdout.trim()) {
          console.log(`Failed to find process with command: ${cmdArray[index]}. Error: ${error}`);
          tryCommands(cmdArray, index + 1);
          return;
        }

        // Extract PID based on platform
        let pid;
        if (process.platform === 'win32') {
          // For netstat, split and take the last column
          pid = stdout.trim().split('\n')[0]?.trim().split(/\s+/).pop();
        } else {
          pid = stdout.trim();
        }

        console.log(`Found process on port ${port}, PID: ${pid}`);
        resolve(pid || null);
      });
    };

    tryCommands(platformCommands);
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
  try {
    const pid = await findProcessId(port);
    if (pid) {
      console.log(`Attempting to kill process on port ${port}, PID: ${pid}`);
      
      // Multiple kill strategies
      const killCommands = process.platform === 'win32'
        ? [
            `taskkill /F /T /PID ${pid}`,
            `powershell "Stop-Process -Id ${pid} -Force"`
          ]
        : [
            `kill -9 ${pid}`,
            `pkill -f "node.*${port}"`
          ];

      for (const cmd of killCommands) {
        try {
          await new Promise((resolve, reject) => {
            exec(cmd, (error, stdout, stderr) => {
              if (error) {
                console.warn(`Kill command failed: ${cmd}`, error);
                reject(error);
              } else {
                resolve();
              }
            });
          });
          break; // Exit loop if a command succeeds
        } catch (killError) {
          console.warn('Kill attempt failed:', killError);
        }
      }

      // Verify process is killed
      await new Promise(resolve => setTimeout(resolve, 5000));
      const pidAfterKill = await findProcessId(port);
      if (pidAfterKill) {
        console.warn(`Process on port ${port} still running after kill attempts`);
      }
    }
    console.log(`${directoryName} shutdown process completed`);
  } catch (error) {
    console.error(`Shutdown failed for ${directoryName}:`, error);
    throw error;
  }
}

async function forceDeleteDirectory(directoryPath) {
  const maxAttempts = 10;
  const delay = 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Use more aggressive deletion
      await fs.rm(directoryPath, { 
        recursive: true, 
        force: true,
        maxRetries: 3,
        retryDelay: 1000
      });
      console.log(`Successfully deleted directory: ${directoryPath}`);
      return;
    } catch (error) {
      console.error(`Attempt ${attempt} - Error deleting directory ${directoryPath}:`, error);

      // Additional cleanup attempts
      try {
        // Kill all node processes associated with the directory
        if (process.platform === 'win32') {
          exec(`taskkill /F /IM node.exe`, (killError) => {
            if (killError) console.warn('Error killing node processes:', killError);
          });
        } else {
          exec(`pkill -f node`, (killError) => {
            if (killError) console.warn('Error killing node processes:', killError);
          });
        }

        // Additional Windows-specific cleanup
        if (process.platform === 'win32') {
          exec(`rmdir /s /q "${directoryPath}"`, (rmError) => {
            if (rmError) console.warn('Error using rmdir:', rmError);
          });
        }
      } catch (cleanupError) {
        console.error('Cleanup attempt failed:', cleanupError);
      }

      // If it's the last attempt, throw the error
      if (attempt === maxAttempts) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

app.delete("/delete-store/:storeId", async (req, res) => {
  const { storeId } = req.params;

  try {
    const storeIndex = storeRegistry.findIndex(store => store.storeId === storeId);
    if (storeIndex === -1) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    const store = storeRegistry[storeIndex];

    try {
      await shutdownStore(store.directoryName, store.port);
      await PortManager.releasePort(store.port); //release port
    } catch (shutdownError) {
      console.warn(`Warning: Could not gracefully shut down ${store.directoryName}:`, shutdownError);
    }

    const storePath = path.join(__dirname, "apps", store.directoryName);
    
    try {
      await forceDeleteDirectory(storePath);
    } catch (deleteError) {
      console.error(`Persistent error deleting directory for ${store.directoryName}:`, deleteError);
      // Consider additional manual cleanup or logging
    }

    // Remove from registry
    storeRegistry = storeRegistry.filter(s => s.storeId !== storeId);
    await saveStoreRegistry();

    res.json({
      success: true,
      message: "Store deletion process completed",
      deletedStore: store,
    });
  } catch (error) {
    console.error("Unexpected error in store deletion:", error);
    res.status(500).json({
      success: false,
      message: "Error in store deletion process",
      error: error.message,
    });
  }
});

app.put("/update-store", async (req, res) => {
  const { store_id, name } = req.body;

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

    // Update store registry
    storeRegistry[storeIndex] = {
      ...store,
      storeName: name
    };

    // Save updated registry
    await saveStoreRegistry();

    // Update constants.ts file
    const constantsPath = path.join(storePath, "constants", "constants.ts");
    
    try {
      const constantsContent = await fs.readFile(constantsPath, "utf8");
      const updatedConstantsContent = constantsContent.replace(
        /export const NEXT_STORE_NAME = ".*"/,
        `export const NEXT_STORE_NAME = "${name}"`
      );
      
      await fs.writeFile(constantsPath, updatedConstantsContent);
    } catch (fileError) {
      console.error("Error updating constants file:", fileError);
      // Non-fatal error, store registry is still updated
    }

    res.json({
      success: true,
      message: "Store updated successfully",
      updatedStore: {
        ...store,
        storeName: name
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


async function startServer() {
  await fetchAndWriteStores()
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
