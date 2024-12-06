// Modify update-store endpoint to handle potential port conflicts
// Replace the existing /update-store endpoint with the following code if adding preferredport option.
app.put("/update-store", async (req, res) => {
    const { store_id, name, preferredPort } = req.body;
  
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
  
      // If a preferred port is specified, find an available port near it
      let newPort = store.port;
      if (preferredPort && preferredPort !== store.port) {
        newPort = await PortManager.findAvailablePortNear(preferredPort);
        
        // If a new port is allocated, release the old one
        if (newPort !== store.port) {
          await PortManager.releasePort(store.port);
        }
      }
  
      // Update store registry
      storeRegistry[storeIndex] = {
        ...store,
        storeName: name,
        port: newPort,
        url: `http://localhost:${newPort}`
      };
  
      // Save updated registry
      await saveStoreRegistry();
  
      // Update constants.ts file
      const constantsPath = path.join(storePath, "constants", "constants.ts");
      
      try {
        const constantsContent = await fs.readFile(constantsPath, "utf8");
        const updatedConstantsContent = constantsContent
          .replace(/export const NEXT_STORE_NAME = ".*"/, `export const NEXT_STORE_NAME = "${name}"`)
          .replace(/export const NEXT_PORT = ".*"/, `export const NEXT_PORT = "${newPort}"`);
        
        await fs.writeFile(constantsPath, updatedConstantsContent);
  
        // Update package.json to use new port
        const packageJsonPath = path.join(storePath, "package.json");
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
        packageJson.scripts.dev = `next dev -p ${newPort}`;
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
        // Update port.js
        const portPath = path.join(storePath, "constants", "port.js");
        const portContent = `const NEXT_PORT = "${newPort}"
  
  module.exports = {
      NEXT_PORT,
    };`;
        await fs.writeFile(portPath, portContent);
      } catch (fileError) {
        console.error("Error updating store configuration files:", fileError);
        // Non-fatal error, store registry is still updated
      }
  
      res.json({
        success: true,
        message: "Store updated successfully",
        updatedStore: {
          ...store,
          storeName: name,
          port: newPort,
          url: `http://localhost:${newPort}`
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