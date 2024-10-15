import { Lifetime } from "awilix";
import { ApparelDesign } from "../models/apparelDesign";
import { TransactionBaseService } from "@medusajs/medusa";

type CreateApparelDesignInput = {
    design: object;
    thumbnail_images?: string;
    isActive?: string;
    archive?: string;
    customer_id?: string;
    vendor_id?: string;
};

class ApparelDesignService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;
    private readonly apparelDesignRepository: any;

    constructor(container) {
        super(container);
        this.manager_ = container.manager;

        try {
            this.apparelDesignRepository = container.apparelDesignRepository;
        } catch (e) {
            console.error("Error initializing ApparelDesignService:", e);
        }
    }

    // Create a new ApparelDesign record
    async create(designObject: CreateApparelDesignInput): Promise<ApparelDesign> {
        // if (!designObject.vendor_id) {
        //     throw new Error("Vendor ID is required to create an apparel design.");
        // }

        // if (!designObject.customer_id) {
        //     throw new Error("Customer ID is required to create an apparel design.");
        // }

        const newDesign = this.apparelDesignRepository.create(designObject);
        return await this.apparelDesignRepository.save(newDesign);
    }

    // Retrieve an ApparelDesign by ID
    async retrieve(designId: string): Promise<ApparelDesign> {
        const design = await this.apparelDesignRepository.findOne({ where: { id: designId } });

        if (!design) {
            throw new Error("Apparel Design not found.");
        }

        return design;
    }
    async retrieveByCustomerId(customerId: string): Promise<ApparelDesign> {
        const design = await this.apparelDesignRepository.findOne({ where: { customer_id: customerId } });

        if (!design) {
            throw new Error("Apparel Design with given customer ID is not found.");
        }

        return design;
    }


    // List all ApparelDesign records or filter by a selector (e.g., vendor_id or customer_id)
    async list(selector: Partial<CreateApparelDesignInput>): Promise<ApparelDesign[]> {
        return await this.apparelDesignRepository.find({ where: selector });
    }

    // Update an ApparelDesign record by ID
    async update(designId: string, update: Partial<CreateApparelDesignInput>): Promise<ApparelDesign> {
        const existingDesign = await this.apparelDesignRepository.findOne({ where: { id: designId } });

        if (!existingDesign) {
            throw new Error(`Apparel Design with ID ${designId} not found`);
        }

        const updatedDesign = this.apparelDesignRepository.merge(existingDesign, update);
        return await this.apparelDesignRepository.save(updatedDesign);
    }

    // Retrieve ApparelDesign by vendor_id
    async retrieveByVendorId(vendorId: string): Promise<ApparelDesign[]> {
        if (!vendorId) {
            throw new Error("Vendor ID is required");
        }

        const designs = await this.apparelDesignRepository.find({ where: { vendor_id: vendorId } });

        if (designs.length === 0) {
            throw new Error("No Apparel Designs found for the specified vendor.");
        }

        return designs;
    }

    //Archive an apparel design (soft delete)
    async archive(designId: string): Promise<ApparelDesign> {
        const design = await this.retrieve(designId);
        design.archive = true;
        return await this.apparelDesignRepository.save(design);
    }

    // List active ApparelDesigns (not archived)
    async listActive(selector: Partial<CreateApparelDesignInput>): Promise<ApparelDesign[]> {
        return await this.apparelDesignRepository.find({
            where: { ...selector, archive: false },
        });
    }

    //List archived ApparelDesigns (for management purposes)
    async listArchived(selector: Partial<CreateApparelDesignInput>): Promise<ApparelDesign[]> {
        return await this.apparelDesignRepository.find({
            where: { ...selector, archive: true },
        });
    }
}

export default ApparelDesignService;
