// hooks/useStock.ts
import { Next_server } from "@/constant";
import { useState, useEffect } from "react";

const API_BASE_URL = `${Next_server}/api`; // Adjust based on your env



interface Variant {
  variantId: string
  stockId: string
  size: string
  color: string
  totalQuantity: number
  availableQuantity: number
  onHoldQuantity: number
  exhaustedQuantity: number
  createdAt: string
  updatedAt: string
  stock_id: string
}

interface Stock {
  stock_id: string
  title: string
  totalQuantity: number
  availableQuantity: number
  onHoldQuantity: number
  exhaustedQuantity: number
  createdAt: string
  updatedAt: string
  StockVariants: Variant[]
  totals: {
    totalQuantity: number
    availableQuantity: number
    onHoldQuantity: number
    exhaustedQuantity: number
  }
  availableVariants: {
    sizes: string[]
    colors: string[]
  }
}



interface StockResponse {
  success: boolean;
  stocks: Stock[];
}

interface AddStockData {
  title: string;
  variants: { size: string; color: string | null; totalQuantity: number }[];
}

export function useStock() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [standardProducts, setStandardProducts] = useState<any[]>([]); // Adjust type if you have a StandardProduct interface
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/stock`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch stocks");
      const data: StockResponse = await response.json();
      setStocks(data.stocks || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStandardProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/standardproducts`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch standard products");
      const data = await response.json();
      setStandardProducts(data.products || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addStock = async (stockData: AddStockData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stockData),
      });
      if (!response.ok) throw new Error("Failed to add stock");
      const data = await response.json();
      setStocks(prev => [...prev, data.stock]);
      return data.stock;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const restockVariant = async (variantId: string, quantity: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/stock/restock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity }),
      });
      if (!response.ok) throw new Error("Failed to restock variant");
      const data = await response.json();
      setStocks(prev =>
        prev.map(stock => ({
          ...stock,
          StockVariants: stock.StockVariants.map(v =>
            v.variantId === variantId ? { ...v, ...data.variant } : v
          ),
        }))
      );
      return data.variant;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    fetchStandardProducts();
  }, []);

  return {
    stocks,
    standardProducts,
    loading,
    error,
    fetchStocks,
    addStock,
    restockVariant,
  };
}