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
  const cartItems = useSelector((state: RootState) => state.cart.items || []);
  const loading = useSelector((state: RootState) => state.cart.loading);
  const error = useSelector((state: RootState) => state.cart.error);

  const customerId =
    typeof window !== "undefined" ? sessionStorage.getItem("customerId") : null;

      const fetchCartData = async () => {
        if (!customerId) return;
  
        dispatch(setLoading(true));
  
        try {
          const response = await fetch(
            `http://localhost:5000/api/carts/customer/${customerId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
  
          if (!response.ok) {
            throw new Error("Failed to fetch cart data");
          }
  
          const data = await response.json();
          dispatch(fetchCartSuccess(data));
        } catch (error: any) {
          dispatch(setError(error.message));
        } finally {
          dispatch(setLoading(false));
        }
      };
  
      
  

  const updateCartQuantity = async (cartId: string, quantity: number) => {
    try {
      dispatch(setLoading(true));
      
      dispatch(updateCartItemQuantity({ cartId, quantity }));

      const response = await fetch(
        `http://localhost:5000/api/carts/${cartId}/quantity`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        }
      );

      if (!response.ok) {
        const cartResponse = await fetch(
          `http://localhost:5000/api/carts/customer/${customerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (cartResponse.ok) {
          const data = await cartResponse.json();
          dispatch(fetchCartSuccess(data));
        }
        throw new Error("Failed to update cart quantity");
      }

      return true;
    } catch (error: any) {
      dispatch(setError(error.message));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteCart = async (cartId: string) => {
    try {
      dispatch(removeFromCart(cartId));

      const response = await fetch(
        `http://localhost:5000/api/carts/customer/${customerId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const cartResponse = await fetch(
          `http://localhost:5000/api/carts/customer/${customerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (cartResponse.ok) {
          const data = await cartResponse.json();
          dispatch(fetchCartSuccess(data));
        }
        throw new Error("Failed to delete cart");
      }

      return true;
    } catch (error: any) {
      dispatch(setError(error.message));
      return false;
    }
  };

  const updateCart = async (
    cartId: any,
    designState: IDesign[],
    propsState: IProps,
    designs: IDesign[]
  ) => {
    try {
      dispatch(setLoading(true));
      const updatedData = {
        designState,
        propsState,
        designs,
      };
      const response = await fetch(
        `http://localhost:5000/api/carts/${cartId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }
      if (response.ok) {
        localStorage.removeItem("cart_id");
        localStorage.removeItem("savedPropsState");
        localStorage.removeItem("savedDesignState");
      }
      const data = await response.json();
      dispatch(fetchCartSuccess(data.updatedCartData));

      return true;
    } catch (error: any) {
      dispatch(setError(error.message));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const addDesignToCart = async (
    designs: IDesign[],
    customerToken: string,
    svgUrl: string | null,
    designState: IDesign[],
    propsState: IProps
  ) => {
    if (!customerToken) return false;

    try {
      dispatch(setLoading(true));

      const validDesigns = designs.filter((design) => design.pngImage);
      if (validDesigns.length === 0) {
        throw new Error("No valid designs to add to cart");
      }

      const processedDesigns = await Promise.all(
        validDesigns.map(async (design) => ({
          id: design.id,
          apparel: design.apparel,
          items: design.items,
          pngImage: design.pngImage,
          svgImage: null,
          isactive: design.isactive,
          jsonDesign: design.jsonDesign,
          uploadedImages: design.uploadedImages || [],
          textProps: design.textProps,
        }))
      );

      const basePrice = processedDesigns.length * 100;

      const response = await fetch(`${baseUrl}/api/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customerId,
          product_type: "Designable",
          designs: processedDesigns,
          designState: designState,
          propsState: propsState,
          quantity: 1,
          price: basePrice,
          email: email
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add designs to the cart");
      }

      const data = await response.json();
      fetchCartData();
      dispatch(fetchCartSuccess(data));

      return true;
    } catch (error: any) {
      dispatch(setError(error.message));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const clearAllCart = async () => {
    if (!customerId) return false;

    try {
      dispatch(setLoading(true));

      const response = await fetch(
        `http://localhost:5000/api/carts/customer/${customerId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      dispatch(clearCart());
      return true;
    } catch (error: any) {
      dispatch(setError(error.message));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    cartItems,
    loading,
    error,
    deleteCart,
    updateCart,
    addDesignToCart,
    updateCartQuantity,
    clearCart: clearAllCart,
  };
};