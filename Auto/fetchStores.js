const fetch = require('node-fetch');

/**
 * @typedef {Object} Store
 * @property {string} [id]
 * @property {string} name
 * @property {string} default_sales_channel_id
 * @property {string} [default_currency_code]
 * @property {string} [swap_link_template]
 * @property {string} [payment_link_template]
 * @property {string} [invite_link_template]
 * @property {string} [default_location_id]
 * @property {Object} [metadata]
 * @property {string} [publishableapikey]
 * @property {string} [store_url]
 */

/**
 * @typedef {Object} StoreClientConfig
 * @property {string} baseURL
 * @property {number} [timeout]
 * @property {Object<string, string>} [headers]
 */

/**
 * A client for interacting with store endpoints
 */
class StoreClient {
  /**
   * Create a new StoreClient
   * @param {StoreClientConfig} config Configuration for the client
   */
  constructor(config) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 10000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...(config.headers || {})
    };
  }

  /**
   * Helper method to create a URL with query parameters
   * @param {string} path Base path
   * @param {Object<string, string>} [params] Query parameters
   * @returns {string} Full URL with query parameters
   */
  createURL(path, params) {
    const url = new URL(path, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  /**
   * Helper method to handle fetch requests with timeout
   * @param {string | URL} input URL or Request object
   * @param {RequestInit} [init] Request initialization options
   * @returns {Promise<Response>} Promise resolving to the response
   */
  fetchWithTimeout(input, init = {}) {
    return new Promise((resolve, reject) => {
      const controller = new AbortController();
      const { signal } = controller;

      const timeoutId = setTimeout(() => {
        controller.abort();
        reject(new Error('Request timed out'));
      }, this.timeout);

      fetch(input, { 
        ...init, 
        signal 
      })
        .then(response => {
          clearTimeout(timeoutId);
          resolve(response);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Fetch all stores
   * @returns {Promise<Store[]>} Promise resolving to an array of stores
   */
  async getStores() {
    try {
      const url = this.createURL('/stores');
      
      const response = await this.fetchWithTimeout(url, {
        method: 'GET',
        headers: this.defaultHeaders
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      this.handleError(error, 'Error fetching stores');
      throw error;
    }
  }

  /**
   * Create a new store
   * @param {Store} storeData Data for the new store
   * @returns {Promise<Store>} Promise resolving to the created store
   */
  async createStore(storeData) {
    try {
      // Validate required fields
      this.validateStoreData(storeData);

      const response = await this.fetchWithTimeout(this.createURL('/stores'), {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify(storeData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      this.handleError(error, 'Error creating store');
      throw error;
    }
  }

  /**
   * Update an existing store
   * @param {string} storeId ID of the store to update
   * @param {Partial<Store>} updateData Data to update
   * @returns {Promise<Store>} Promise resolving to the updated store
   */
  async updateStore(storeId, updateData) {
    try {
      const url = this.createURL(`/stores/${storeId}`);
      
      const response = await this.fetchWithTimeout(url, {
        method: 'PUT',
        headers: this.defaultHeaders,
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.store || result;
    } catch (error) {
      this.handleError(error, 'Error updating store');
      throw error;
    }
  }

  /**
   * Validate store data before creation
   * @param {Store} storeData Store data to validate
   * @throws {Error} If required fields are missing
   */
  validateStoreData(storeData) {
    const requiredFields = [
      'default_sales_channel_id', 
      'name'
    ];

    for (const field of requiredFields) {
      if (!storeData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  /**
   * Handle and log errors
   * @param {Error} error The error object
   * @param {string} message Custom error message
   */
  handleError(error, message) {
    console.error(message, {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
}

/**
 * Factory function to create a Store Client
 * @param {string} baseURL Base URL of the server
 * @param {Object<string, string>} [additionalHeaders] Optional additional headers
 * @returns {StoreClient} StoreClient instance
 */
function createStoreClient(baseURL, additionalHeaders) {
  return new StoreClient({
    baseURL,
    headers: additionalHeaders
  });
}

module.exports = {
  StoreClient,
  createStoreClient
};