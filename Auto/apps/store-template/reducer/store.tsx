import { legacy_createStore } from 'redux';
import { rootReducer } from './rootReducer';

export const store = legacy_createStore(rootReducer);

// Export type for TypeScript support
export type AppDispatch = typeof store.dispatch;
