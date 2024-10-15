import { BusinessModel } from '../models/vendor'; 
export interface VendorData {
  company_name: string;
  contact_name: string;
  registered_number: string;
  contact_email: string;
  contact_phone_number: string;
  tax_number: string;
  vendor_address_id?: string;
  registration_address_id?: string;
  business_nature: BusinessModel;
}
