export interface LineItem {
    product_id: string;
    quantity: number;
    price: number;
  }
  
export interface OrderFormData {
    status: string;
    fulfillment_status: string;
    payment_status: string;
    cart_id: string;
    customer_id: string;
    vendor_id: string;
    email: string;
    region_id: string;
    currency_code: string;
    line_items: LineItem[];
  }
  