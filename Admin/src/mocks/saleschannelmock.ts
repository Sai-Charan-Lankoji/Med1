export const createMockSalesChannelRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    merge: jest.fn(),
  });
  
  export const salesChannelData = {
    vendor_id: "vendor_01J6CD9XBXV88X495ED0VF5JP5",
    id: "sc_01J8SKQ9MP94PY3VAR80AJEN08",
    name: "Design UI",
  };
  
  export const updateData = {
    name: "Updated Sales Channel",
  };
  
  export const vendorId = "vendor_01J6CD9XBXV88X495ED0VF5JP5";
  export const saleschannelId = "sc_01J8SKQ9MP94PY3VAR80AJEN08";
  