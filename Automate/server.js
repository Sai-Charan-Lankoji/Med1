const express = require('express');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('.'));

let currentStatus = 'Ready';
let commandOutput = [];
let storeUrl = null;
let dashboardUrl = null;

let lastUsedPort = 8002;
let lastStoreNumber = 0;

// update constants file
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

function extractUrl(output) {
    const urlMatch = output.match(/http:\/\/localhost:\d+/);
    return urlMatch ? urlMatch[0] : null;
}

app.get('/status', (req, res) => {
    res.json({
        status: currentStatus,
        output: commandOutput,
        storeUrl: storeUrl,
        dashboardUrl: dashboardUrl
    });
});

app.post('/create-store', async (req, res) => {
    console.log('Received create-store request');
    const { storeName, vendorId } = req.body;
    
    currentStatus = 'Starting store creation...';
    commandOutput = [];
    storeUrl = null;
    dashboardUrl = null;

    //  update package.json in the template store
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

    // Update constants file with user inputs
    const constantsUpdate = await updateConstantsFile(storeDir.storePath, storeName, vendorId);
    if (!constantsUpdate.success) {
        currentStatus = 'Failed to update constants file';
        commandOutput.push(`Error: ${constantsUpdate.error}`);
        return res.status(500).json({ message: 'Failed to update constants file' });
    }

    commandOutput.push('Updated constants file with store name and vendor ID');

    //npm install and npm run dev
    const terminal = exec(`cd ${storeDir.storeName} && npm install && npm run dev`, {
        cwd: __dirname
    });

    terminal.stdout.on('data', (data) => {
        console.log('Command output:', data);
        commandOutput.push(data);
        currentStatus = `Executing: ${data}`;

        const url = extractUrl(data);
        if (url) {
            storeUrl = url;
            dashboardUrl = `${url}/dashboard`;
            currentStatus = 'Store is ready!';
        }
    });

    terminal.stderr.on('data', (data) => {
        console.error('Command error:', data);
        commandOutput.push(`Error: ${data}`);
        currentStatus = `Error: ${data}`;
    });

    terminal.on('exit', (code) => {
        console.log('Command execution finished with code:', code);
        currentStatus = code === 0 ? 'Completed successfully' : 'Failed';
    });

    res.json({ message: 'Store creation process started. Check status for progress.' });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});