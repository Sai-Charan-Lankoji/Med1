"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { NEXT_PUBLIC_API_URL } from "../constants/constants";

interface WishlistItem {
  id: string;
  customer_id: string;
  product_id: string | null;
  standard_product_id: string | null;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistCount: number;
  addToWishlist: (item: {
    product_id: string | null;
    standard_product_id: string | null;
  }) => Promise<void>;
  removeFromWishlist: (itemId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/wishlists`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.status === 200 && data.success) {
        setWishlist(data.data || []);
        setWishlistCount(data.data?.length || 0);
      } else {
        setWishlist([]);
        setWishlistCount(0);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
      setWishlistCount(0);
    }
  };

  const addToWishlist = async (item: {
    product_id: string | null;
    standard_product_id: string | null;
  }) => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/wishlists/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(item),
      });
      const data = await response.json();
      if (data.status === 201 && data.success) {
        await fetchWishlist(); // Refresh wishlist after adding
      } else {
        throw new Error(data.message || "Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      await fetchWishlist(); // Ensure state is consistent
      throw error;
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/wishlists/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: itemId }),
      });
      const data = await response.json();
      if (data.status === 200 && data.success) {
        await fetchWishlist(); // Refresh wishlist after removal
      } else {
        throw new Error(data.message || "Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      await fetchWishlist(); // Ensure state is consistent
      throw error;
    }
  };

  const refreshWishlist = async () => {
    await fetchWishlist();
  };

  // Fetch wishlist on mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlist, wishlistCount, addToWishlist, removeFromWishlist, refreshWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};