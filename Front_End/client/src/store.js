import { configureStore } from "@reduxjs/toolkit";
import productsReducer from './Slices/ProductsSlice';
import ProductReducer from './Slices/ProductSlice';
import authReducer from './Slices/AuthSlice';

const store = configureStore({
  reducer: {
    productsState: productsReducer,
    productState: ProductReducer,
    authState: authReducer
  },
  
});

export default store;


// import { configureStore } from '@reduxjs/toolkit';
// import { createStore, applyMiddleware } from 'redux';
// import {thunk} from 'redux-thunk';
// import rootReducer from './rootReducer';

// const store = createStore( rootReducer,applyMiddleware(thunk) );

// export default store;
