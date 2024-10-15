import { Lifetime } from "awilix";
import { TransactionBaseService } from "@medusajs/medusa"; 
import { ApparelUpload } from "../models/apparelUpload";

type CreateApparelUploadInput = {
    url: string;
    apparelDesign_id?: string;
};

class ApparelUploadService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;
    private readonly apparelUploadRepository: any;

    constructor(container) {
        super(container);
        this.manager_ = container.manager;

        try {
            this.apparelUploadRepository = container.apparelUploadRepository;
        } catch (e) {
            console.error("Error initializing ApparelUploadService:", e);
        }
    }

    /**
     * Create a new ApparelUpload record
     */
    async create(UploadObject: CreateApparelUploadInput): Promise<ApparelUpload> {
        if (!UploadObject.apparelDesign_id) {
            throw new Error("Apparel Desgin ID is required to create an apparel Upload.");
        }

        const newUpload = this.apparelUploadRepository.create(UploadObject);
        return await this.apparelUploadRepository.save(newUpload);
    }

    /**
     * Retrieve an ApparelUpload by ID
     */
    async retrieve(UploadId: string): Promise<ApparelUpload> {
        const Upload = await this.apparelUploadRepository.findOne({ where: { id: UploadId } });

        if (!Upload) {
            throw new Error("Apparel Upload not found.");
        }

        return Upload;
    }

    /**
     * List all ApparelUpload records or filter by a selector (e.g., vendor_id or customer_id)
     */
    async list(selector: Partial<CreateApparelUploadInput>): Promise<ApparelUpload[]> {
        return await this.apparelUploadRepository.find({ where: selector });
    }
}

export default ApparelUploadService;
