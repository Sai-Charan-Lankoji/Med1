import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducer/rootReducer'; 
import { useUserContext } from '@/context/userContext'; 
import { 
  addToCart, 
  removeFromCart, 
  clearCart, 
  setLoading, 
  setError, 
  fetchCartSuccess
} from '../../reducer/cartReducer';
import { IDesign } from '@/@types/models';

export const useNewCart = () => {
  const { email } = useUserContext();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const loading = useSelector((state: RootState) => state.cart.loading);
  const error = useSelector((state: RootState) => state.cart.error);

  const customerId = sessionStorage.getItem('customerId');

  // Effect to fetch cart data
  useEffect(() => {
    const fetchCartData = async () => {
      if (!customerId) return; // Exit if no customer ID

      dispatch(setLoading(true)); // Set loading to true

      try {
        const response = await fetch(`http://localhost:9000/store/cart?id=${customerId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }

        const data = await response.json();
        console.log("Fetched Cart Data:", data);

        // Dispatch the action to store fetched data in Redux
        dispatch(fetchCartSuccess(data)); 
      } catch (error: any) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false)); // Set loading to false
      }
    };

    fetchCartData(); // Call the fetch function
  }, [dispatch, customerId]); // Dependency array

  const addDesignToCart = async (designs: IDesign[], customerToken: string, svgUrl: string | null) => {
    if (!customerToken) {
      return false;
    }

    try {
      dispatch(setLoading(true));
      
      const validDesigns = designs.filter(design => design.pngImage);
      if (validDesigns.length === 0) {
        throw new Error("No valid designs to add to cart");
      }

      const processedDesigns = await Promise.all(
        validDesigns.map(async (design) => ({
          id: design.id,
          apparel: design.apparel,
          items: design.items,
          pngImage: null, 
          svgImage: design.svgImage,
          isactive: design.isactive,
          jsonDesign: null,
          uploadedImages: design.uploadedImages || [],
          textProps: design.textProps,
        }))
      );

      const response = await fetch("http://localhost:9000/store/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          designs: processedDesigns,
          quantity: 1,
          price: 100,
          email: email,
          customer_id: customerId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add designs to the cart");
      } 

      const data = await response.json();
      console.log("Cart Data:", data);
      dispatch(fetchCartSuccess(data)); 

      // // Dispatch the addToCart action if the API call was successful
      // dispatch(addToCart({
      //   designs: processedDesigns,
      //   quantity: 1,
      //   price: 100,
      //   email: email,
      //   customer_id: customerId,
      // })); 

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
    addDesignToCart,
    removeFromCart: (id: string) => dispatch(removeFromCart(id)),
    clearCart: () => dispatch(clearCart())
  };
};
