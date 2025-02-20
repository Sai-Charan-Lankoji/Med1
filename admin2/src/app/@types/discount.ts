export interface Discount {
    id?: string;
    base_discount_threshold: number;
    high_discount_threshold: number;
    base_discount_rate: number;
    high_discount_rate: number;
  }