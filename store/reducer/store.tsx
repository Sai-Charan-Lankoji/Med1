import { legacy_createStore } from 'redux';
import { reducers } from './canvasreducer';
export const store = legacy_createStore(reducers);

 