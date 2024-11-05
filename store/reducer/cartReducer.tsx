import { AnyAction } from 'redux';
import { ICartItem } from '@/@types/models';

// Define cart state interface
interface CartState {
  items: ICartItem[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

// Action types
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const CLEAR_CART = 'CLEAR_CART';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS';

// Action creators
export const addToCart = (item: ICartItem) => ({
  type: ADD_TO_CART,
  payload: item,
});

export const removeFromCart = (id: string) => ({
  type: REMOVE_FROM_CART,
  payload: id,
});

export const clearCart = () => ({
  type: CLEAR_CART,
});

export const setLoading = (loading: boolean) => ({
  type: SET_LOADING,
  payload: loading,
});

export const setError = (error: string | null) => ({
  type: SET_ERROR,
  payload: error,
}); 


export const fetchCartSuccess = (cartData: ICartItem[]) => ({
  type: FETCH_CART_SUCCESS,
  payload: cartData,
});

// Reducer
export const cartReducer = (state = initialState, action: AnyAction): CartState => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case CLEAR_CART:
      return {
        ...state,
        items: [],
      };
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

      case FETCH_CART_SUCCESS:
      return {
        ...state,
        items: action.payload, // Update the items with fetched cart data
      };
    default:
      return state;
  }
};

