import axios from 'axios'
import { ProductsRequest, ProductsSuccess, productsFail } from '../Slices/ProductsSlice';
import { ProductRequest, ProductSuccess, productFail } from '../Slices/ProductSlice';

export const getProducts = (keyword, price, category,rating,currentPage) => async (dispatch) => {

    try {
        dispatch(ProductsRequest())

        let link = `/api/v1/products?page=${currentPage}`;

        if (keyword) {
            link += `&keyword=${keyword}`
        }

        if (price) {
            link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`
        }

        if(category) {
            link += `&category=${category}`
        }

        if(rating) {
            link += `&ratings=${rating}`
        }

        const { data } = await axios.get(link);
        dispatch(ProductsSuccess(data))
        console.log(data, data)
    } catch (error) {
        //handle error 

        dispatch(productsFail(error.response.data.message))
    }
}



export const getProduct = id => async (dispatch) => {

    try {
        dispatch(ProductRequest())
        const { data } = await axios.get(`/api/v1/product/${id}`);
        dispatch(ProductSuccess(data));
    } catch (error) {
        //handle error 

        dispatch(productFail(error.response.data.message))
    }
}