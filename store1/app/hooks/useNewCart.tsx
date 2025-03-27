import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducer/rootReducer";
import { useUserContext } from "@/context/userContext";
import {
  setLoading,
  setError,
  fetchCartSuccess,
} from "../../reducer/cartReducer";
import {
  IDesign,
  IProps,
  IDesignableCartItem,
  IStandardCartItem,
} from "@/@types/models";
import { NEXT_PUBLIC_API_URL } from "@/constants/constants";
import { useCallback, useState, useEffect } from "react";

const baseUrl = NEXT_PUBLIC_API_URL;

export const useNewCart = () => {
  const { email } = useUserContext();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const [customerId, setCustomerId] = useState("");

  const fetchCurrentUser = async () => {
    try {
      const meResponse = await fetch(`${baseUrl}/api/customer/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!meResponse.ok) {
        throw new Error("Failed to fetch user details");
      }

      const customer = await meResponse.json();
      setCustomerId(customer.data.id);
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCartData = useCallback(async () => {
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
      const designableItems: IDesignableCartItem[] =
        data.data.designable_products || [];
      const standardItems: IStandardCartItem[] =
        data.data.standard_products || [];

      dispatch(
        fetchCartSuccess({
          designable: designableItems,
          standard: standardItems,
        })
      );
      return { designable: designableItems, standard: standardItems };
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [customerId, dispatch]);

  const addDesignToCart = useCallback(
    async (
      designs: IDesign[],
      designState: IDesign[],
      propsState: IProps,
      productId?: string,
      quantity: number = 1,
      selectedSize?: string,
      selectedColor?: string
    ): Promise<boolean> => {
      if (!customerId) return false;

      try {
        dispatch(setLoading(true));

        const validDesigns = designs.filter((design) => design.pngImage);
        if (!validDesigns.length) throw new Error("No valid designs to add");

        const processedDesigns = validDesigns.map((design) => ({
          ...design,
          svgImage: null,
        }));

        const response = await fetch(`${baseUrl}/api/carts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: customerId,
            product_id: productId || null,
            product_type: "designable",
            designs: processedDesigns,
            designState,
            propsState,
            quantity,
            selected_size: selectedSize || null,
            selected_color: selectedColor || null,
            email: email || null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.details || "Failed to add designable product to cart"
          );
        }

        await fetchCartData();
        return true;
      } catch (error: any) {
        dispatch(setError(error.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [customerId, email, dispatch, fetchCartData]
  );

  const addStandardProductToCart = useCallback(
    async (
      productId: string,
      quantity: number,
      selectedSize?: string,
      selectedColor?: string,
      selectedVariantId?: string
    ): Promise<boolean> => {
      if (!customerId) return false;

      try {
        dispatch(setLoading(true));

        const response = await fetch(`${baseUrl}/api/carts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: customerId,
            product_id: productId,
            product_type: "standard",
            quantity,
            selected_size: selectedSize || null,
            selected_color: selectedColor || null,
            selected_variant: selectedVariantId || null,
            email: email || null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.details || "Failed to add standard product to cart"
          );
        }

        await fetchCartData();
        return true;
      } catch (error: any) {
        dispatch(setError(error.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [customerId, email, dispatch, fetchCartData]
  );

  const updateCartItem = useCallback(
    async (
      cartId: string,
      designs: IDesign[],
      designState: IDesign[],
      propsState: IProps
    ): Promise<boolean> => {
      if (!customerId) return false;

      try {
        dispatch(setLoading(true));

        const validDesigns = designs.filter((design) => design.pngImage);
        if (!validDesigns.length) throw new Error("No valid designs to update");

        const processedDesigns = validDesigns.map((design) => ({
          ...design,
          svgImage: null,
        }));

        const response = await fetch(`${baseUrl}/api/carts/${cartId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            designs: processedDesigns,
            designState,
            propsState,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.details || "Failed to update cart item"
          );
        }

        await fetchCartData();
        return true;
      } catch (error: any) {
        dispatch(setError(error.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [customerId, dispatch, fetchCartData]
  );

  const updateCartQuantity = useCallback(
    async (cartId: string, quantity: number): Promise<boolean> => {
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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.details || "Failed to update cart quantity"
          );
        }

        await fetchCartData();
        return true;
      } catch (error: any) {
        dispatch(setError(error.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, fetchCartData]
  );

  const deleteCartItem = useCallback(
    async (cartId: string): Promise<boolean> => {
      try {
        dispatch(setLoading(true));

        const response = await fetch(`${baseUrl}/api/carts/${cartId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to delete item");

        await fetchCartData();
        return true;
      } catch (error: any) {
        dispatch(setError(error.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, fetchCartData]
  );

  const getDesignableCartItems = () => {
    return cart.designable || [];
  };

  const getStandardCartItems = () => {
    return cart.standard || [];
  };

  return {
    cartItems: getDesignableCartItems(),
    loading: cart.loading,
    error: cart.error,
    fetchCartData,
    addDesignToCart,
    addStandardProductToCart,
    updateCartItem,
    updateCartQuantity,
    deleteCartItem,
    getStandardCartItems,
  };
};