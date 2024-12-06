const fs = require('fs').promises;
const path = require('path');

class PortManager {
  constructor(options = {}) {
    this.startPort = options.startPort || 8010;
    this.endPort = options.endPort || 9000;
    this.portsFile = path.join(__dirname, 'allocated_ports.json');
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