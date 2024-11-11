import { combineReducers } from 'redux';
import { reducers as canvasReducer } from './canvasreducer';
import { cartReducer } from './cartReducer';

export const rootReducer = combineReducers({
  canvas: canvasReducer,
  cart: cartReducer,
});


export type RootState = ReturnType<typeof rootReducer>;