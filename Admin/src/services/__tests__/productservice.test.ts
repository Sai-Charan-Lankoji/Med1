import { IsNull } from "typeorm";
import { MockRepository } from "../mocks/productmock";
import ProductService from "../product";

const mockProductRepository = MockRepository();
const mockVendorRepository = MockRepository();

const productService = new ProductService({
    productRepository: mockProductRepository,
    vendorRepository: mockVendorRepository,
});


describe("ProductService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a new product with a vendor ID", async () => {
            const productData = {
                id: "product-id",
                vendor_id: "vendor-id",
                title: "Test Product",
                description: "Test Description",
                handle: "test",
            };

            const mockProduct = { ...productData, id: "product-id" };

            mockProductRepository.create.mockReturnValue(mockProduct); 
            mockProductRepository.save.mockResolvedValue(mockProduct); 

            const result = await productService.create(productData); 

            expect(mockProductRepository.create).toHaveBeenCalledWith(productData);
            expect(mockProductRepository.save).toHaveBeenCalledWith(mockProduct);
            expect(result).toEqual(mockProduct);
        });

        it("should throw an error if vendor_id is not provided", async () => {
            const productData = {
                id: "product-id",
                title: "Test Product",
                description: "Test Description",
                subtitle: "test",
            };

            await expect(productService.create(productData)).rejects.toThrow("Vendor ID is required to create a product.");
        });
    });


    describe("update", () => {
        it("should update an existing product", async () => {
            const productId = "product-id";
            const updateData = {
                name: "Updated Product",
                description: "Updated Description",
                price: 150,
            };

            const existingProduct = { id: productId, name: "Old Product", ...updateData };
            const updatedProduct = { id: productId, ...updateData };

            mockProductRepository.findOne.mockResolvedValue(existingProduct);
            mockProductRepository.merge = jest.fn(() => updatedProduct);
            mockProductRepository.save.mockResolvedValue(updatedProduct);

            const result = await productService.update(productId, updateData);

            expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: productId } });
            expect(mockProductRepository.merge).toHaveBeenCalledWith(existingProduct, updateData);
            expect(mockProductRepository.save).toHaveBeenCalledWith(updatedProduct);
            expect(result).toEqual(updatedProduct);
        });

        it("should throw an error if the product does not exist", async () => {
            const productId = "nonexistent-id";
            const updateData = {
                title: "Updated Product",
            };

            mockProductRepository.findOne.mockResolvedValue(null);

            await expect(productService.update(productId, updateData)).rejects.toThrow(`Product with ID ${productId} not found`);
        });
    });

    describe("delete", () => {
        it("should delete an existing product", async () => {
            const productId = "product-id";
            const existingProduct = { id: productId };

            mockProductRepository.findOne.mockResolvedValue(existingProduct);
            mockProductRepository.delete.mockResolvedValue(undefined);

            await productService.delete(productId);

            expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: productId } });
            expect(mockProductRepository.delete).toHaveBeenCalledWith({ id: productId });
        });

        it("should throw an error if the product does not exist", async () => {
            const productId = "nonexistent-id";

            mockProductRepository.findOne.mockResolvedValue(null);

            await expect(productService.delete(productId)).rejects.toThrow(`Product with ID ${productId} not found`);
        });
    });

    describe("list", () => {
        it("should return a list of products with vendor information", async () => {
            const selector = { title: "Test Product" };
            const config = {};
            const mockProducts = [
                { id: "product1", title: "Product One", vendor_id: "vendor1" },
                { id: "product2", title: "Product Two", vendor_id: "vendor2" },
            ];

            mockProductRepository.find.mockResolvedValue(mockProducts);

            const result = await productService.list(selector, config);

            expect(mockProductRepository.find).toHaveBeenCalledWith({ where: selector, ...config });
            expect(result).toEqual(mockProducts);
        });
    });

    describe("listAndCount", () => {
        it("should return paginated products and total count", async () => {
            const selector = {};
            const config = { skip: 0, take: 2 };
            const mockProducts = [
                { id: "product1", title: "Product One" },
                { id: "product2", title: "Product Two" },
            ];
            const totalProducts = 5;

            mockProductRepository.findAndCount.mockResolvedValue([mockProducts, totalProducts]);

            const [result, count] = await productService.listAndCount(selector, config);

            expect(mockProductRepository.findAndCount).toHaveBeenCalledWith({ where: selector, ...config });
            expect(result).toEqual(mockProducts);
            expect(count).toEqual(totalProducts);
        });
    });
    describe("retrieve", () => {
        it("should return a product by its ID", async () => {
            const productId = "product-id";
            const mockProduct = { id: productId, title: "Test Product", vendor_id: "vendor-id" };
            mockProductRepository.findOne.mockResolvedValue(mockProduct);
            const result = await productService.retrieve(productId);

            expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: productId } });
            expect(result).toEqual(mockProduct);
        });

        it("should throw an error if the product is not found", async () => {
            const productId = "non_existent_product";

            mockProductRepository.findOne.mockResolvedValue(null);

            await expect(productService.retrieve(productId)).rejects.toThrow("Product not found.");
        });
    });



    describe("retrieveByVendorId", () => {
        it("should return products by vendor ID", async () => {
            const vendorId = "vendor-id";
            const mockProducts = [
                { id: "product1", title: "Product One", vendor_id: vendorId },
                { id: "product2", title: "Product Two", vendor_id: vendorId },
            ];

            mockProductRepository.findOne.mockResolvedValue({ id: vendorId });
            mockProductRepository.find.mockResolvedValue(mockProducts);

            const result = await productService.retrieveByVendorId(vendorId);

            expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { vendor_id: vendorId } });
            expect(mockProductRepository.find).toHaveBeenCalledWith({ where: { vendor_id: vendorId } });
            expect(result).toEqual(mockProducts);
        });

        it("should throw an error if no product is found for the vendor", async () => {
            const vendorId = "nonexistent-id";

            mockProductRepository.findOne.mockResolvedValue(null);

            await expect(productService.retrieveByVendorId(vendorId))
                .rejects
                .toThrow(`No Products are found`);
        });

        it("should return products when vendorId is null", async () => {
            const mockProducts = [
              { id: "product1", title: "Product One", vendor_id: null },
              { id: "product2", title: "Product Two", vendor_id: null },
            ];
          
            mockProductRepository.find.mockResolvedValue(mockProducts);
          
            const result = await productService.retrieveByVendorId(null);
          
            expect(mockProductRepository.find).toHaveBeenCalledWith({ where: {} });
            expect(result).toEqual(mockProducts);
          });
          
    });

    describe("retrieveByNullVendor", () => {
        it("should return products with null vendor_id", async () => {
            const mockProducts = [
                { id: "product1", title: "Product One", vendor_id: null },
                { id: "product2", title: "Product Two", vendor_id: null },
            ];
    
            // Mocking the find method to return products with null vendor_id
            mockProductRepository.find.mockResolvedValue(mockProducts);
    
            // Calling the service method
            const result = await productService.retrieveByNullVendor();
    
            // Verifying that the find method was called with the correct query
            expect(mockProductRepository.find).toHaveBeenCalledWith({
                where: { vendor_id: IsNull() },
            });
    
            // Expecting the result to match the mock products
            expect(result).toEqual(mockProducts);
        });
    
        it("should return an empty array when no products have null vendor_id", async () => {
            // Mocking the find method to return an empty array
            mockProductRepository.find.mockResolvedValue([]);
    
            // Calling the service method
            const result = await productService.retrieveByNullVendor();
    
            // Verifying that the find method was called with the correct query
            expect(mockProductRepository.find).toHaveBeenCalledWith({
                where: { vendor_id: IsNull() },
            });
    
            // Expecting the result to be an empty array
            expect(result).toEqual([]);
        });
    
        it("should throw an error if the repository fails", async () => {
            const errorMessage = "Database query failed";
    
            // Mocking the find method to throw an error
            mockProductRepository.find.mockRejectedValue(new Error(errorMessage));
    
            // Calling the service method and expecting it to throw the same error
            await expect(productService.retrieveByNullVendor()).rejects.toThrow(errorMessage);
    
            // Verifying that the find method was called with the correct query
            expect(mockProductRepository.find).toHaveBeenCalledWith({
                where: { vendor_id: IsNull() },
            });
        });
    });
    
});