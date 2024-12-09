import {
    createMockSalesChannelRepository,
    salesChannelData,
    updateData,
    vendorId,
    saleschannelId,
  } from "../../mocks/saleschannelmock";
  import SalesChannelService from "../salesChannel";
  
  describe("SalesChannelService", () => {
    let salesChannelService;
    let mockSalesChannelRepository;
  
    beforeEach(() => {
      // Initialize mock repository
      mockSalesChannelRepository = createMockSalesChannelRepository();
  
      const container = {
        salesChannelRepository: mockSalesChannelRepository,
      };
  
      // Create an instance of SalesChannelService
      salesChannelService = new SalesChannelService(container);
    });
  
    describe("create", () => {
      it("should create a sales channel successfully with valid data", async () => {
        // Arrange
        mockSalesChannelRepository.create.mockReturnValue(salesChannelData);
        mockSalesChannelRepository.save.mockResolvedValue(salesChannelData);
  
        // Act
        const result = await salesChannelService.create(salesChannelData);
  
        // Assert
        expect(mockSalesChannelRepository.create).toHaveBeenCalledWith(
          salesChannelData
        );
        expect(mockSalesChannelRepository.save).toHaveBeenCalledWith(
          salesChannelData
        );
        expect(result).toEqual(salesChannelData);
      });
  
      it("should throw an error if vendor_id is missing", async () => {
        // Arrange
        const invalidSalesChannelData = {
          ...salesChannelData,
          vendor_id: undefined,
        };
  
        // Act & Assert
        await expect(
          salesChannelService.create(invalidSalesChannelData)
        ).rejects.toThrow("Vendor ID is required to create a Sales Channel.");
      });
    });
  
    describe("retrieve", () => {
      it("should retrieve a sales channel by ID", async () => {
        // Arrange
        mockSalesChannelRepository.findOne.mockResolvedValue(salesChannelData);
  
        // Act
        const result = await salesChannelService.retrieve(saleschannelId);
  
        // Assert
        expect(mockSalesChannelRepository.findOne).toHaveBeenCalledWith({
          where: { id: saleschannelId },
        });
        expect(result).toEqual(salesChannelData);
      });
  
      it("should throw an error if sales channel is not found", async () => {
        // Arrange
        mockSalesChannelRepository.findOne.mockResolvedValue(null);
  
        // Act & Assert
        await expect(
          salesChannelService.retrieve(saleschannelId)
        ).rejects.toThrow("Sales Channel not found.");
      });
    });
  
    describe("update", () => {
      it("should update a sales channel successfully", async () => {
        // Arrange
        mockSalesChannelRepository.findOne.mockResolvedValue(salesChannelData);
        mockSalesChannelRepository.merge.mockReturnValue(updateData);
        mockSalesChannelRepository.save.mockResolvedValue(updateData);
  
        // Act
        const result = await salesChannelService.update(
          saleschannelId,
          updateData
        );
  
        // Assert
        expect(mockSalesChannelRepository.findOne).toHaveBeenCalledWith({
          where: { id: saleschannelId },
        });
        expect(mockSalesChannelRepository.merge).toHaveBeenCalledWith(
          salesChannelData,
          updateData
        );
        expect(mockSalesChannelRepository.save).toHaveBeenCalledWith(updateData);
        expect(result).toEqual(updateData);
      });
  
      it("should throw an error if sales channel ID is not provided", async () => {
        // Act & Assert
        await expect(
          salesChannelService.update(null, updateData)
        ).rejects.toThrow(
          "Sales Channel ID is required to update a Sales Channel"
        );
      });
  
      it("should throw an error if sales channel is not found", async () => {
        // Arrange
        mockSalesChannelRepository.findOne.mockResolvedValue(null);
  
        // Act & Assert
        await expect(
          salesChannelService.update(saleschannelId, updateData)
        ).rejects.toThrow(`SalesChannel with ID ${saleschannelId} not found`);
      });
    });
  
    describe("listSalesChannelsByVendor", () => {
      it("should return sales channels for a given vendor ID", async () => {
        // Arrange
        const salesChannels = [salesChannelData]; // Mock sales channel data
        mockSalesChannelRepository.findOne.mockResolvedValue(salesChannelData); // Mock findOne to return a sales channel
        mockSalesChannelRepository.find.mockResolvedValue(salesChannels); // Mock find to return the list of sales channels
  
        // Act
        const result = await salesChannelService.listSalesChannelsByVendor(salesChannelData.vendor_id);
  
        // Assert
        expect(mockSalesChannelRepository.findOne).toHaveBeenCalledWith({
          where: { vendor_id: salesChannelData.vendor_id },
        });
        expect(mockSalesChannelRepository.find).toHaveBeenCalledWith({
          where: { vendor_id: salesChannelData.vendor_id },
        });
        expect(result).toEqual(salesChannels); // Ensure the result matches the mocked sales channels
      });
  
      it("should throw an error if no sales channels are found for the given vendor ID", async () => {
        // Arrange
        mockSalesChannelRepository.findOne.mockResolvedValue(null); // No sales channel found
  
        // Act & Assert
        await expect(salesChannelService.listSalesChannelsByVendor(salesChannelData.vendor_id)).rejects.toThrow(
          `No Sales Channels are found for vendor ID: ${salesChannelData.vendor_id}`
        );
      });
    });
  });