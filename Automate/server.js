const express = require('express');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());  // Enable CORS for Next.js frontend
app.use(express.json());

// Store state management
let currentStatus = 'Ready';
let commandOutput = [];
let lastUsedPort = 8002;
let lastStoreNumber = 0;

// Store registry to keep track of all stores
const STORES_FILE = path.join(__dirname, 'stores.json');
let storeRegistry = [];

// Initialize store registry from file
async function initializeStoreRegistry() {
    try {
        const data = await fs.readFile(STORES_FILE, 'utf8');
        storeRegistry = JSON.parse(data);
        
        // Update lastStoreNumber and lastUsedPort based on existing stores
        storeRegistry.forEach(store => {
            const storeNum = parseInt(store.directoryName.replace('store', ''));
            lastStoreNumber = Math.max(lastStoreNumber, storeNum);
            const port = parseInt(store.port);
            lastUsedPort = Math.max(lastUsedPort, port);
        });
        
        console.log('Store registry loaded:', storeRegistry);
    } catch (error) {
        console.log('No existing stores file found, starting fresh');
        storeRegistry = [];
    }
}

// Save store registry to file
async function saveStoreRegistry() {
    try {
        await fs.writeFile(STORES_FILE, JSON.stringify(storeRegistry, null, 2));
    } catch (error) {
        console.error('Error saving store registry:', error);
    }
}

// Start all existing stores
async function startExistingStores() {
    for (const store of storeRegistry) {
        await startStore(store.directoryName, store.port);
    }
}

// Function to start a single store
async function startStore(directoryName, port) {
    return new Promise((resolve) => {
        const terminal = exec(`cd ${directoryName} && npm run dev`, {
            cwd: __dirname
        });

        terminal.stdout.on('data', (data) => {
            console.log(`[${directoryName}] ${data}`);
            if (data.includes(`http://localhost:${port}`)) {
                console.log(`${directoryName} is running on port ${port}`);
                resolve(true);
            }
        });

        terminal.stderr.on('data', (data) => {
            console.error(`[${directoryName}] Error:`, data);
        });
    });
}

// Update package.json with new port
async function updatePackageJson(storePath) {
    try {
        lastUsedPort++;
        const packageJsonPath = path.join(storePath, 'package.json');
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
        
        packageJson.scripts.dev = `next dev -p ${lastUsedPort}`;
        
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
        
        return {
            success: true,
            port: lastUsedPort
        };
    } catch (error) {
        console.error('Error updating package.json:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Create new store directory
async function createStoreDirectory(port) {
    lastStoreNumber++;
    const newStoreName = `store${lastStoreNumber}`;
    const sourcePath = path.join(__dirname, 'store');
    const targetPath = path.join(__dirname, newStoreName);

    try {
        await fs.access(sourcePath);
        await fs.cp(sourcePath, targetPath, { recursive: true });
        
        return {
            success: true,
            storePath: targetPath,
            storeName: newStoreName
        };
    } catch (error) {
        console.error('Error creating store directory:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Update constants file with store details
async function updateConstantsFile(storePath, storeDetails) {
    try {
        const constantsPath = path.join(storePath, 'constants', 'constant.ts');
        const constantsContent = `export const NEXT_PUBLIC_API_URL = "http://localhost:9000"
export const NEXT_PUBLIC_API_KEY = "pk_01J9JQNA1HVN8XRFV8PGNAJHP0"
export const NEXT_PUBLIC_VENDOR_ID = "${storeDetails.vendor_id}"
export const NEXT_STORE_NAME = "${storeDetails.name}"
export const NEXT_PUBLIC_STORE_ID = "${storeDetails.id}"
export const NEXT_PUBLIC_SALES_CHANNEL_ID = "${storeDetails.default_sales_channel_id}"
export const NEXT_PUBLIC_CURRENCY_CODE = "${storeDetails.default_currency_code}"`;
        
        await fs.writeFile(constantsPath, constantsContent, 'utf8');
        return {
            success: true
        };
    } catch (error) {
        console.error('Error updating constants file:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// API Endpoints
app.post('/create-store', async (req, res) => {
    console.log('Received create-store request:', req.body);
    const storeDetails = req.body;
    
    // Update package.json in the template store
    const portUpdate = await updatePackageJson(path.join(__dirname, 'store'));
    if (!portUpdate.success) {
        return res.status(500).json({ 
            success: false,
            message: 'Failed to update package.json',
            error: portUpdate.error
        });
    }

    // Creating new store directory
    const storeDir = await createStoreDirectory(portUpdate.port);
    if (!storeDir.success) {
        return res.status(500).json({ 
            success: false,
            message: 'Failed to create store directory',
            error: storeDir.error
        });
    }

    // Update constants file with store details
    const constantsUpdate = await updateConstantsFile(storeDir.storePath, storeDetails);
    if (!constantsUpdate.success) {
        return res.status(500).json({ 
            success: false,
            message: 'Failed to update constants file',
            error: constantsUpdate.error
        });
    }

    // Add store to registry
    const storeInfo = {
        directoryName: storeDir.storeName,
        storeName: storeDetails.name,
        vendorId: storeDetails.vendor_id,
        storeId: storeDetails.id,
        salesChannelId: storeDetails.default_sales_channel_id,
        currencyCode: storeDetails.default_currency_code,
        port: portUpdate.port,
        url: `http://localhost:${portUpdate.port}`,
        dashboardUrl: `http://localhost:${portUpdate.port}/dashboard`
    };
    
    storeRegistry.push(storeInfo);
    await saveStoreRegistry();

    // Start the new store
    try {
        await new Promise((resolve, reject) => {
            const terminal = exec(`cd ${storeDir.storeName} && npm install && npm run dev`, {
                cwd: __dirname
            });

            terminal.stdout.on('data', (data) => {
                console.log('Command output:', data);
                if (data.includes(`http://localhost:${portUpdate.port}`)) {
                    resolve();
                }
            });

            terminal.stderr.on('data', (data) => {
                console.error('Command error:', data);
            });
        });

        res.json({ 
            success: true,
            message: 'Store created successfully',
            storeInfo: storeInfo
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error starting store',
            error: error.message
        });
    }
});

// Get all stores
app.get('/stores', (req, res) => {
    res.json(storeRegistry);
});

// Initialize and start server
async function startServer() {
    await initializeStoreRegistry();
    await startExistingStores();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Store creation server running on http://localhost:${PORT}`);
        console.log('Active stores:', storeRegistry.length);
    });
}

startServer();