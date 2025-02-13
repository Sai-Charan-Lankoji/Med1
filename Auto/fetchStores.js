const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Hardcoded URL for fetching stores
const STORES_URL = 'http://localhost:9000/vendor/store';

/**
 * Fetch stores from the main server
 * @returns {Promise<Array>} Fetched stores
 */
async function fetchStoresFromMainServer() {
  return new Promise((resolve, reject) => {
    // Parse the URL
    const url = new URL(STORES_URL);

    // Choose the appropriate protocol client
    const client = url.protocol === 'https:' ? https : http;

    // Create request options
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Make the request
    const req = client.request(url, options, (res) => {
      let data = '';

      // Accumulate data chunks
      res.on('data', (chunk) => {
        data += chunk;
      });

      // Process complete response
      res.on('end', () => {
        try {
          // Check response status
          if (res.statusCode < 200 || res.statusCode >= 300) {
            throw new Error(`HTTP Status Code: ${res.statusCode}`);
          }

          // Parse JSON response
          const stores = JSON.parse(data);
          resolve(stores);
        } catch (error) {
          reject(new Error(`Error processing response: ${error.message}`));
        }
      });
    });

    // Handle request errors
    req.on('error', (error) => {
      reject(new Error(`Network error: ${error.message}`));
    });

    // End the request
    req.end();
  });
}

/**
 * Transform stores to the required format
 * @param {Array} stores - Raw stores from the main server
 * @returns {Array} Transformed stores
 */
function transformStores(stores) {
  return stores.map((store, index) => ({
    directoryName: `store_${extractPortFromUrl(store.store_url)}`,
    storeName: store.name || 'Unnamed Store',
    vendorId: store.vendor_id || 'unknown_vendor',
    storeId: store.id || 'unknown_store_id',
    salesChannelId: store.default_sales_channel_id || null,
    currencyCode: (store.default_currency_code || 'usd').toLowerCase(),
    port: extractPortFromUrl(store.store_url),
    url: store.store_url || `null`,
    
  }));
}

/**
 * Extract port from URL
 * @param {string} urlString - The URL to extract port from
 * @returns {number} Extracted port number
 */
function extractPortFromUrl(urlString) {
  try {
    if (!urlString) return 8000; // default port
    const parsedUrl = new URL(urlString);
    return parseInt(parsedUrl.port) || 
           (parsedUrl.protocol === 'https:' ? 443 : 80);
  } catch {
    return 8000; // default port if URL parsing fails
  }
}

/**
 * Write stores to store.json file
 * @param {Array} stores - Transformed stores
 * @param {string} [outputPath] - Custom output path
 */
async function writeStoresToFile(stores, outputPath) {
  const storeFilePath = outputPath || 
  path.resolve(process.cwd(), 'stores.json');

try {
  // First, check if the file exists
  let existingStores = [];
  try {
    const existingData = await fs.readFile(storeFilePath, 'utf8');
    existingStores = JSON.parse(existingData);
  } catch (readError) {
    // If file doesn't exist or is empty, start with an empty array
    if (readError.code !== 'ENOENT') {
      throw readError;
    }
  }

  // Create a Set to track unique stores based on a unique identifier
  const storeSet = new Set(existingStores.map(store => store.storeId));

  // Filter out duplicate stores and add new ones
  const newStores = stores.filter(store => {
    if (!storeSet.has(store.storeId)) {
      storeSet.add(store.storeId);
      return true;
    }
    return false;
  });

  // Combine existing and new stores
  const combinedStores = [...existingStores, ...newStores];

  // Write the combined stores back to the file
  await fs.writeFile(
    storeFilePath,
    JSON.stringify(combinedStores, null, 2)
  );

  console.log(`Stores successfully written to ${storeFilePath}`);
  console.log(`Added ${newStores.length} new stores`);

  return combinedStores;
} catch (error) {
  console.error(`Error writing stores to file: ${error.message}`);
  throw error;
}
}

/**
 * Main function to fetch and write stores
 * @param {string} [outputPath] - Optional custom output path
 * @returns {Promise<Array>} Transformed stores
 */
async function fetchAndWriteStores(outputPath) {
  try {
    // Fetch stores from main server
    const rawStores = await fetchStoresFromMainServer();

    // Transform stores
    const transformedStores = transformStores(rawStores);

    // Write to file
    await writeStoresToFile(transformedStores, outputPath);

    return transformedStores;
  } catch (error) {
    console.error('Error in fetchAndWriteStores:', error);
    throw error;
  }
}

// Export the functions for potential use in other scripts
module.exports = {
  fetchAndWriteStores,
  fetchStoresFromMainServer,
  transformStores,
  writeStoresToFile,
  extractPortFromUrl
};

// If script is run directly, execute the fetch
if (require.main === module) {
  fetchAndWriteStores()
    .then(stores => console.log('Stores fetched successfully:', stores))
    .catch(console.error);
}