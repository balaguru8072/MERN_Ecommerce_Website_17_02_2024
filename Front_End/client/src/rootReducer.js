import { combineReducers } from '@reduxjs/toolkit';
import productsReducer from './Slices/ProductsSlice';
import ProductReducer from './Slices/ProductSlice';
import authReducer from './Slices/AuthSlice';

const rootReducer = combineReducers({
    productsState: productsReducer,
    productState: ProductReducer,
    authState: authReducer
  });
  
  export default rootReducer;