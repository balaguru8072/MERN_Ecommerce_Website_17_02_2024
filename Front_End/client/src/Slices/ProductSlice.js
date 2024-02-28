import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: {
        loading: false,
        product: null,
        error: null
    },
    reducers:{
        ProductRequest(state, action){
            return{
                loading: true,
            }
        },
        ProductSuccess(state, action){
            return{
                loading: false,
                product: action.payload.product
            }
        },
        productFail(state, action){
            return{
                loading: false,
                error: action.payload
            }
        }
    }
});

const {actions, reducer } = productSlice;

export const { ProductRequest, ProductSuccess, productFail} = actions;


export default reducer;