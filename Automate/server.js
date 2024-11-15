const express = require('express');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('.'));

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

// Helper function to extract URL from command output
function extractUrl(output) {
    const urlMatch = output.match(/http:\/\/localhost:\d+/);
    return urlMatch ? urlMatch[0] : null;
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

// Update constants file
async function updateConstantsFile(storePath, storeName, vendorId) {
    try {
        const constantsPath = path.join(storePath, 'constants', 'constant.ts');
        const constantsContent = `export const NEXT_PUBLIC_API_URL = "http://localhost:9000"
export const NEXT_PUBLIC_API_KEY = "pk_01J9JQNA1HVN8XRFV8PGNAJHP0"
export const NEXT_PUBLIC_VENDOR_ID = "${vendorId}"
export const NEXT_STORE_NAME = "${storeName}"`;
        
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

// Routes
app.get('/status', (req, res) => {
    res.json({
        status: currentStatus,
        output: commandOutput,
        stores: storeRegistry
    });
});

app.get('/stores', (req, res) => {
    res.json(storeRegistry);
});

app.post('/create-store', async (req, res) => {
    console.log('Received create-store request');
    const { storeName, vendorId } = req.body;
    
    currentStatus = 'Starting store creation...';
    commandOutput = [];

    // Update package.json in the template store
    const portUpdate = await updatePackageJson(path.join(__dirname, 'store'));
    if (!portUpdate.success) {
        currentStatus = 'Failed to update package.json';
        commandOutput.push(`Error: ${portUpdate.error}`);
        return res.status(500).json({ message: 'Failed to update package.json' });
    }

    commandOutput.push(`Updated package.json with port: ${portUpdate.port}`);

    // Creating new store directory
    const storeDir = await createStoreDirectory(portUpdate.port);
    if (!storeDir.success) {
        currentStatus = 'Failed to create store directory';
        commandOutput.push(`Error: ${storeDir.error}`);
        return res.status(500).json({ message: 'Failed to create store directory' });
    }

    commandOutput.push(`Created new store directory: ${storeDir.storeName}`);

    // Update constants file
    const constantsUpdate = await updateConstantsFile(storeDir.storePath, storeName, vendorId);
    if (!constantsUpdate.success) {
        currentStatus = 'Failed to update constants file';
        commandOutput.push(`Error: ${constantsUpdate.error}`);
        return res.status(500).json({ message: 'Failed to update constants file' });
    }

    // Add store to registry
    const storeInfo = {
        directoryName: storeDir.storeName,
        storeName: storeName,
        vendorId: vendorId,
        port: portUpdate.port,
        url: `http://localhost:${portUpdate.port}`,
        dashboardUrl: `http://localhost:${portUpdate.port}/dashboard`
    };
    
    storeRegistry.push(storeInfo);
    await saveStoreRegistry();

    // Start the new store
    const terminal = exec(`cd ${storeDir.storeName} && npm install && npm run dev`, {
        cwd: __dirname
    });

    terminal.stdout.on('data', (data) => {
        console.log('Command output:', data);
        commandOutput.push(data);
        currentStatus = `Executing: ${data}`;

        if (data.includes(`http://localhost:${portUpdate.port}`)) {
            currentStatus = 'Store is ready!';
        }
    });

    terminal.stderr.on('data', (data) => {
        console.error('Command error:', data);
        commandOutput.push(`Error: ${data}`);
        currentStatus = `Error: ${data}`;
    });

    res.json({ 
        message: 'Store creation process started. Check status for progress.',
        storeInfo: storeInfo
    });
});

// Initialize and start server
async function startServer() {
    await initializeStoreRegistry();
    await startExistingStores();
    
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
        console.log('Active stores:', storeRegistry.length);
    });
}

startServer();