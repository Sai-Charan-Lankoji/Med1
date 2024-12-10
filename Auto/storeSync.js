const fs = require('fs').promises;
const path = require('path');
const PortManager = require('./portAllocator');

class StoreSyncManager {
  constructor(options = {}) {
    this.appsDir = options.appsDir || path.join(__dirname, 'apps');
    this.storesFilePath = options.storesFilePath || path.join(__dirname, 'stores.json');
  }

  /**
   * Synchronize store directories with the store registry
   * @param {Array} storeRegistry - Current store registry
   * @returns {Object} Synchronization results
   */
  async synchronizeStores(storeRegistry) {
    try {
      // Read all directories in the apps folder
      const appDirectories = await fs.readdir(this.appsDir);
      
      // Filter out non-directory items and exclude store-template
      const storeDirectories = (await Promise.all(
        appDirectories.filter(dir => dir !== 'store-template' && !dir.startsWith('.'))
          .map(async (dir) => {
            const fullPath = path.join(this.appsDir, dir);
            const stat = await fs.stat(fullPath);
            return stat.isDirectory() ? dir : null;
          })
      )).filter(Boolean);

      // Tracks actions taken during synchronization
      const syncResults = {
        directoriesCreated: [],
        directoriesRemoved: [],
        errorsEncountered: []
      };

      // Check for directories without registry entries
      for (const dir of storeDirectories) {
        const matchingStore = storeRegistry.find(store => store.directoryName === dir);
        
        if (!matchingStore) {
          // Directory exists but not in registry - remove it
          try {
            const fullPath = path.join(this.appsDir, dir);
            await this.forceDeleteDirectory(fullPath);
            syncResults.directoriesRemoved.push(dir);
          } catch (error) {
            console.error(`Error removing orphaned directory ${dir}:`, error);
            syncResults.errorsEncountered.push({
              directory: dir,
              error: error.message
            });
          }
        }
      }

      // Check for registry entries without directories
      for (const store of storeRegistry) {
        const directoryExists = storeDirectories.includes(store.directoryName);
        
        if (!directoryExists) {
          try {
            // Recreate the store directory
            await this.recreateStoreFromRegistry(store);
            syncResults.directoriesCreated.push(store.directoryName);
            console.log(`Recreated store directory for ${store.directoryName}`);
          } catch (error) {
            console.error(`Error recreating store ${store.directoryName}:`, error);
            syncResults.errorsEncountered.push({
              store: store.directoryName,
              error: error.message
            });
          }
        }
      }

      return syncResults;
    } catch (error) {
      console.error('Store synchronization failed:', error);
      throw error;
    }
  }

  /**
   * Recreate a store directory using registry information
   * @param {Object} storeInfo - Store information from registry
   */
  async recreateStoreFromRegistry(storeInfo) {
    const sourcePath = path.join(this.appsDir, 'store-template');
    const targetPath = path.join(this.appsDir, storeInfo.directoryName);

    try {
      // Create directory
      await fs.mkdir(targetPath, { recursive: true });
      
      // Copy template files
      await fs.cp(sourcePath, targetPath, { recursive: true });

      // Update package.json
      const packageJsonPath = path.join(targetPath, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
      packageJson.name = storeInfo.directoryName;
      packageJson.scripts.dev = `next dev -p ${storeInfo.port}`;
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

      // Update constants.ts
      const constantsPath = path.join(targetPath, 'constants', 'constants.ts');
      const constantsContent = `
export const NEXT_PUBLIC_API_URL = "http://localhost:9000"
export const NEXT_PUBLIC_API_KEY = "${storeInfo.publishableapikey || ''}"
export const NEXT_PUBLIC_VENDOR_ID = "${storeInfo.vendorId || ''}"
export const NEXT_STORE_NAME = "${storeInfo.storeName}"
export const NEXT_PUBLIC_STORE_ID = "${storeInfo.storeId}"
export const NEXT_PUBLIC_SALES_CHANNEL_ID = "${storeInfo.salesChannelId || ''}"
export const NEXT_PUBLIC_CURRENCY_CODE = "${storeInfo.currencyCode || ''}"
export const NEXT_PORT = "${storeInfo.port}"
      `;
      await fs.writeFile(constantsPath, constantsContent);

      // Update port.js
      const portPath = path.join(targetPath, 'constants', 'port.js');
      const portContent = `const NEXT_PORT = "${storeInfo.port}"

module.exports = {
    NEXT_PORT,
  };`;
      await fs.writeFile(portPath, portContent);

      console.log(`Recreated store directory for ${storeInfo.directoryName}`);
    } catch (error) {
      console.error(`Failed to recreate store ${storeInfo.directoryName}:`, error);
      throw error;
    }
  }

  /**
   * Force delete a directory with robust error handling
   * @param {string} directoryPath - Path to the directory to delete
   */
  async forceDeleteDirectory(directoryPath) {
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
            require('child_process').exec(`taskkill /F /IM node.exe`, (killError) => {
              if (killError) console.warn('Error killing node processes:', killError);
            });
          } else {
            require('child_process').exec(`pkill -f node`, (killError) => {
              if (killError) console.warn('Error killing node processes:', killError);
            });
          }

          // Additional Windows-specific cleanup
          if (process.platform === 'win32') {
            require('child_process').exec(`rmdir /s /q "${directoryPath}"`, (rmError) => {
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
}

module.exports = StoreSyncManager;