import { AnyAction } from "redux";
import { IDesignableCartItem, IStandardCartItem } from "@/@types/models";

// Define cart state interface
interface CartState {
  designable: IDesignableCartItem[];
  standard: IStandardCartItem[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CartState = {
  designable: [],
  standard: [],
  loading: false,
  error: null,
};

// Action types
export const ADD_TO_CART = "ADD_TO_CART";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const FETCH_CART_SUCCESS = "FETCH_CART_SUCCESS";

// Action creators
export const addToCart = (item: IDesignableCartItem | IStandardCartItem) => ({
  type: ADD_TO_CART,
  payload: item,
});

export const setLoading = (loading: boolean) => ({
  type: SET_LOADING,
  payload: loading,
});

export const setError = (error: string | null) => ({
  type: SET_ERROR,
  payload: error,
});

export const fetchCartSuccess = (cartData: {
  designable: IDesignableCartItem[];
  standard: IStandardCartItem[];
}) => ({
  type: FETCH_CART_SUCCESS,
  payload: cartData,
});

// Reducer
export const cartReducer = (
  state = initialState,
  action: AnyAction
): CartState => {
  switch (action.type) {
    case ADD_TO_CART: {
      const item = action.payload as IDesignableCartItem | IStandardCartItem;
      if (item.product_type === "designable") {
        return {
          ...state,
          designable: [...state.designable, item as IDesignableCartItem],
        };
      } else if (item.product_type === "standard") {
        return {
          ...state,
          standard: [...state.standard, item as IStandardCartItem],
        };
      }
      return state; // No change if product_type is invalid
    }

    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case FETCH_CART_SUCCESS: {
      const { designable, standard } = action.payload as {
        designable: IDesignableCartItem[];
        standard: IStandardCartItem[];
      };
      return {
        ...state,
        designable: designable || [],
        standard: standard || [],
      };
    }

    default:
      return state;
  }
};
