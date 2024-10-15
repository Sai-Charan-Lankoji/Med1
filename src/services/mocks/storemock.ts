export const createMockStoreRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  });
  
  export const storeData = {
    vendor_id: "vendor_01J6CD9XBXV88X495ED0VF5JP5",
    default_sales_channel_id: "sc_01J8SKQ9MP94PY3VAR80AJEN08",
    name: "Design UI",
  };
  