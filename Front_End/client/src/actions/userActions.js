import axios from "axios";
import { loginFail, loginRequest, loginSuccess , clearError, registerRequest, registerSuccess, registerFail, loadUserRequest, logoutSuccess, logoutFail} from "../Slices/AuthSlice"

export const login =  (email,password) => async (dispatch) =>{
    try {
        dispatch(loginRequest())
        const { data } = await axios.post('/api/v1/login', {email, password});
        dispatch(loginSuccess(data))
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            dispatch(loginFail(error.response.data.message));
        } else {
            // Handle other types of errors (e.g., network errors)
            dispatch(loginFail("An error occurred"));
        }
    }
}

export const clearAuthError = dispatch =>{
    dispatch(clearError())
}

export const register =  (useData) => async (dispatch) =>{
    try {
        dispatch(registerRequest())
        const config = {
            header: {
                'Content-type' : 'mutipart/form-data'
            }
        }

        const { data } = await axios.post('/api/v1/register', useData, config);
        dispatch(registerSuccess(data))
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            dispatch(registerFail(error.response.data.message));
        } else {
            // Handle other types of errors (e.g., network errors)
            dispatch(registerFail("An error occurred"));
        }
    }
}

export const loadUser =   async (dispatch) =>{
    try {
        dispatch(loadUserRequest())

        const { data } = await axios.get('/api/v1/myprofile');
        dispatch(loginSuccess(data))
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            dispatch(loginFail(error.response.data.message));
        } else {
            // Handle other types of errors (e.g., network errors)
            dispatch(loginFail("An error occurred"));
        }
    }
}

export const logout =   async (dispatch) =>{
    try {
        await axios.get('/api/v1/logout');
        dispatch(logoutSuccess())
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            dispatch(logoutFail(error.response.data.message));
        } else {
            // Handle other types of errors (e.g., network errors)
            dispatch(logoutFail("An error occurred"));
            console.log(error.res,"fsdfjsdfjhfj")
        }
    }
}