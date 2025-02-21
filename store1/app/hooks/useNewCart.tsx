import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducer/rootReducer";
import { useUserContext } from "@/context/userContext";
import {
  removeFromCart,
  clearCart,
  setLoading,
  setError,
  fetchCartSuccess,
  updateCartItemQuantity,
} from "../../reducer/cartReducer";
import { IDesign, IProps } from "@/@types/models";
import { useRouter } from "next/navigation";
import { NEXT_PUBLIC_API_URL } from "@/constants/constants";

const baseUrl = NEXT_PUBLIC_API_URL;

export const useNewCart = () => {
  const router = useRouter();
  const { email } = useUserContext();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items || {});
  const loading = useSelector((state: RootState) => state.cart.loading);
  const error = useSelector((state: RootState) => state.cart.error);

  const customerId = typeof window !== "undefined" 
    ? sessionStorage.getItem("customerId") 
    : null;

  // Fetch both designable and standard cart items
  const fetchCartData = async () => {
    if (!customerId) return;

    dispatch(setLoading(true));

    try {
      const response = await fetch(
        `${baseUrl}/api/carts/customer/${customerId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch cart data");
      
      const data = await response.json();
      
      // Update Redux store with both product types
      dispatch(fetchCartSuccess({
        designable:data.data.designable_products || [],
        standard: data.data.standard_products || []
      }));

    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Add designable product (existing function)
  const addDesignToCart = async (
    designs: IDesign[],
    designState: IDesign[],
    propsState: IProps
  ) => {
    if (!customerId) return false;

    try {
      dispatch(setLoading(true));

      const validDesigns = designs.filter((design) => design.pngImage);
      if (!validDesigns.length) throw new Error("No valid designs to add");

      const processedDesigns = validDesigns.map(design => ({
        ...design,
        svgImage: null, // Explicitly set to avoid sending large SVG data
      }));

      const response = await fetch(`${baseUrl}/api/carts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          product_type: "designable",
          designs: processedDesigns,
          designState,
          propsState,
          quantity: 1,
          email: email
        }),
      });

      if (!response.ok) throw new Error("Failed to add designable product");
      
      fetchCartData(); // Refresh cart data after addition
      return true;

    } catch (error: any) {
      dispatch(setError(error.message));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // New function for standard products
  const addStandardProductToCart = async (
    productId: string,
    quantity: number,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    if (!customerId) return false;

    try {
      dispatch(setLoading(true));

      const response = await fetch(`${baseUrl}/api/carts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          product_type: "standard",
          product_id: productId,
          quantity,
          selected_size: selectedSize,
          selected_color: selectedColor,
          email: email
        }),
      });

      if (!response.ok) throw new Error("Failed to add standard product");
      
      fetchCartData(); // Refresh cart data
      return true;

    } catch (error: any) {
      dispatch(setError(error.message));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Universal quantity update
  const updateCartQuantity = async (cartId: string, quantity: number) => {
    try {
      dispatch(setLoading(true));

      const response = await fetch(
        `${baseUrl}/api/carts/${cartId}/quantity`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        }
      );

      if (!response.ok) throw new Error("Failed to update quantity");
      
      fetchCartData(); // Refresh after update
      return true;

    } catch (error: any) {
      dispatch(setError(error.message));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Delete specific cart item
  const deleteCartItem = async (cartId: string) => {
    try {
      dispatch(setLoading(true));

      const response = await fetch(`${baseUrl}/api/carts/${cartId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete item");
      
      fetchCartData(); // Refresh after deletion
      return true;

    } catch (error: any) {
      dispatch(setError(error.message));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Get only designable products
  const getDesignableCartItems = () => {
    return cartItems.designable || [];
  };

  // Get only standard products
  const getStandardCartItems = () => {
    return cartItems.standard || [];
  };

  return {
    cartItems: getDesignableCartItems(), 
    loading,
    error,
    fetchCartData,
    addDesignToCart,
    addStandardProductToCart,
    updateCartQuantity,
    deleteCartItem,
    getStandardCartItems, 
  };
};