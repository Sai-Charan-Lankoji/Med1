export interface SalesChannelResponse {
    id: string;
    name: string;
    description: string;
    vendor_id: string;
    // Add other fields as needed
  }
  
export  interface StoreResponse {
    id: string;
    storeName: string;
    // Add other fields as needed
  }

export interface StoreFormData {
  name: string,
  default_sales_channel_id: string,
  swap_link_template: string,
  payment_link_template: string,
  invite_link_template: string,
  vendor_id: string,
  store_type: string,
  publishableapikey: string
}