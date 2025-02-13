const fs = require('fs').promises;
const path = require('path');

class PortManager {
  constructor(options = {}) {
    this.startPort = options.startPort || 8010;
    this.endPort = options.endPort || 8999;
    this.portsFile = path.join(__dirname, 'allocated_ports.json');
    this.storesFile = path.join(__dirname, 'stores.json');
    this.allocatedPorts = new Set();
  }

  async initialize() {
    try {
      // Try to load existing allocated ports
      const data = await fs.readFile(this.portsFile, 'utf8');
      this.allocatedPorts = new Set(JSON.parse(data));
    } catch (error) {
      // If file doesn't exist, start with an empty set
      this.allocatedPorts = new Set();
    }

    try {
      // Try to load ports from stores.json
      const storesData = await fs.readFile(this.storesFile, 'utf8');
      const stores = JSON.parse(storesData);
      stores.forEach(store => {
        if (store.port) {
          this.allocatedPorts.add(store.port);
        }
      });
    } catch (error) {
      console.error('Error reading stores.json:', error);
    }
  }

  async allocatePort() {
    // Ensure initialization has happened
    if (this.allocatedPorts.size === 0) {
      await this.initialize();
    }

    // Find the first available port in the range
    for (let port = this.startPort; port <= this.endPort; port++) {
      if (!this.allocatedPorts.has(port)) {
        this.allocatedPorts.add(port);
        await this.saveAllocatedPorts();
        return port;
      }
    }

    throw new Error('No available ports in the specified range');
  }

  async releasePort(port) {
    if (this.allocatedPorts.has(port)) {
      this.allocatedPorts.delete(port);
      await this.saveAllocatedPorts();
    }
  }

  async saveAllocatedPorts() {
    await fs.writeFile(
      this.portsFile, 
      JSON.stringify(Array.from(this.allocatedPorts), null, 2)
    );
  }

  async checkPortAvailability(port) {
    return !this.allocatedPorts.has(port);
  }

  async findAvailablePortNear(preferredPort) {
    // Try the preferred port first
    if (!this.allocatedPorts.has(preferredPort)) {
      this.allocatedPorts.add(preferredPort);
      await this.saveAllocatedPorts();
      return preferredPort;
    }

    // If preferred port is taken, find nearby ports
    const searchRange = 10; // Search 10 ports up and down
    for (let offset = 1; offset <= searchRange; offset++) {
      const lowerPort = preferredPort - offset;
      const upperPort = preferredPort + offset;

      if (lowerPort >= this.startPort && !this.allocatedPorts.has(lowerPort)) {
        this.allocatedPorts.add(lowerPort);
        await this.saveAllocatedPorts();
        return lowerPort;
      }

      if (upperPort <= this.endPort && !this.allocatedPorts.has(upperPort)) {
        this.allocatedPorts.add(upperPort);
        await this.saveAllocatedPorts();
        return upperPort;
      }
    }

    // If no ports near preferred port, use general allocation
    return this.allocatePort();
  }
}

module.exports = new PortManager();


// const fs = require('fs').promises;
// const path = require('path');

// class PortManager {
//   constructor(options = {}) {
//     this.startPort = options.startPort || 8010;
//     this.endPort = options.endPort || 9000;
//     this.storesFile = path.join(__dirname, 'stores.json');
//   }

//   async allocatePort() {
//     // Read existing stores
//     const stores = await this.readStores();
    
//     // Get currently used ports
//     const usedPorts = new Set(stores.map(store => store.port));

//     // Find the first available port in the range
//     for (let port = this.startPort; port <= this.endPort; port++) {
//       if (!usedPorts.has(port)) {
//         return port;
//       }
//     }

//     throw new Error('No available ports in the specified range');
//   }

//   async findAvailablePortNear(preferredPort) {
//     // Read existing stores
//     const stores = await this.readStores();
    
//     // Get currently used ports
//     const usedPorts = new Set(stores.map(store => store.port));

//     // Try the preferred port first
//     if (!usedPorts.has(preferredPort)) {
//       return preferredPort;
//     }

//     // If preferred port is taken, find nearby ports
//     const searchRange = 10; // Search 10 ports up and down
//     for (let offset = 1; offset <= searchRange; offset++) {
//       const lowerPort = preferredPort - offset;
//       const upperPort = preferredPort + offset;

//       if (lowerPort >= this.startPort && !usedPorts.has(lowerPort)) {
//         return lowerPort;
//       }

//       if (upperPort <= this.endPort && !usedPorts.has(upperPort)) {
//         return upperPort;
//       }
//     }

//     // If no ports near preferred port, use general allocation
//     return this.allocatePort();
//   }

//   async readStores() {
//     try {
//       const data = await fs.readFile(this.storesFile, 'utf8');
//       return JSON.parse(data);
//     } catch (error) {
//       // If file doesn't exist or is empty, return an empty array
//       if (error.code === 'ENOENT') {
//         return [];
//       }
//       throw error;
//     }
//   }

//   async updateStorePort(storeId, newPort) {
//     // Read existing stores
//     const stores = await this.readStores();

//     // Find and update the store
//     const updatedStores = stores.map(store => 
//       store.storeId === storeId 
//         ? { ...store, port: newPort, url: `http://localhost:${newPort}` }
//         : store
//     );

//     // Write updated stores back to file
//     await fs.writeFile(
//       this.storesFile, 
//       JSON.stringify(updatedStores, null, 2)
//     );

//     return newPort;
//   }
// }

// module.exports = new PortManager();


// // use cases...

// // const portManager = require('./portManager');

// // // Allocate a new port
// // const newPort = await portManager.allocatePort();

// // // Find a port near a preferred port
// // const nearPort = await portManager.findAvailablePortNear(8080);

// // // Update a specific store's port
// await portManager.updateStorePort('store_01JEMXXFWD1MB7WBH53D6KNXJT', newPort);