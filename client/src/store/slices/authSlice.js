import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

const authSlice =createSlice({
   name:'auth',
   initialState:{
      user:null,
      message:null,
      error:null,
      loading:false,
      isAuthenticated:false,
      //token:null,
      
   },
   reducers:{
    registeRequest(state){
        state.loading=true;
        state.error=null;
        state.message=null;

    },
    registerSuccess(state,action){
        state.loading=false;
        state.message=action.payload.message;
    },
    registerFailed(state,action){
        state.loading=false;
        state.error=action.payload;
    },
    otpVerificationRequest(state){
        state.loading=true;
        state.error=null;
        state.message=null;

    },
    otpVerificationSuccess(state,action){
        state.loading=false;
        state.message=action.payload.message;
        state.isAuthenticated=true;
        state.user=action.payload.user;
    },
    otpVerificationFailed(state,action){
        state.loading=false;
        state.error=action.payload;
    },
    loginRequest(state){
        state.loading=true;
        state.error=null;
        state.message=null;

    },
    loginSuccess(state,action){
        state.loading=false;
        state.message=action.payload.message;
        state.isAuthenticated=true;
        state.user=action.payload.user;
    },
    loginFailed(state,action){
        state.loading=false;
        state.error=action.payload;
    },
    logoutRequest(state){
        state.loading=true;
        state.error=null;
        state.message=null;

    },
    logoutSuccess(state,action){
        state.loading=false;
        state.message=action.payload;
        state.isAuthenticated=false;
        state.user=null;
    },
    logoutFailed(state,action){
        state.loading=false;
        state.error=action.payload;
        state.message=null;
       
       
    },
    getUserRequest(state){
        state.loading=true;
        state.error=null;
        state.message=null;
    },
    getUserSuccess(state,action){
        state.loading=false;
        state.user=action.payload.user;
        state.isAuthenticated=true;

    },
    getUserFailed(state){
        state.loading=false;
        state.user=null;
        state.isAuthenticated=false;
    },
    forgotPasswordRequest(state){
        state.loading=true;
        state.error=null;
        state.message=null;
    },
    forgotPasswordSuccess(state,action){
        state.loading=false;
        state.message=action.payload;

    },
    forgotPasswordFailed(state){
        state.loading=false;
       state.error=action.payload;
    },
    resetPasswordRequest(state){
        state.loading=true;
        state.error=null;
        state.message=null;
    },
    resetPasswordSuccess(state,action){
        state.loading=false;
        state.message=action.payload.message;
        state.user=action.payload.user;
        state.isAuthenticated=true;

    },
    resetPasswordFailed(state){
        state.loading=false;
       state.error=action.payload;
    },
    updatePasswordRequest(state){
        state.loading=true;
        state.error=null;
        state.message=null;
    },
    updatePasswordSuccess(state,action){
        state.loading=false;
        state.message=action.payload;
        

    },
    updatePasswordFailed(state){
        state.loading=false;
       state.error=action.payload;
    },


    resetAuthSlice(){
        state.error=null;
        state.loading=false;
        state.message=null;
        state.user=state.user;
        state.isAuthenticated=state.isAuthenticated;
    },
   },



});

export const resetAuthSlice=()=>(dispatch)=>{
    dispatch(authSlice.actions.resetAuthSlice());
};


export const register =(data)=>async(dispatch)=>{
    dispatch(authSlice.actions.registerRequest());
    await axios.post("http://localhost:4000/api/v1/auth/register",data, {
        withCredentials:true,
        headers:{
            "content-Type":"application/json",
        },


    }).then(res=>{
        dispatch(authSlice.actions.registerSuccess(res.data))
    }).catch(error=>{
        dispatch(authSlice.actions.registerFailed(error.response.data.message));
    });
};
export const otpVerification =(email,otp)=>async(dispatch)=>{
    dispatch(authSlice.actions.otpVerificationRequest());
    await axios.post("http://localhost:4000/api/v1/auth/verify-otp",{email,otp}, {
        withCredentials:true,
        headers:{
            "content-Type":"application/json",
        },


    }).then(res=>{
        dispatch(authSlice.actions.otpVerificationSuccess(res.data))
    }).catch((error)=>{
        dispatch(authSlice.actions.otpVerificationFailed(error.response.data.message));
    });
};
export const login =(data)=>async(dispatch)=>{
    dispatch(authSlice.actions.loginRequest());
    await axios.post("http://localhost:4000/api/v1/auth/login",{data}, {
        withCredentials:true,
        headers:{
            "content-Type":"application/json",
        },


    }).then(res=>{
        dispatch(authSlice.actions.loginSuccess(res.data))
    }).catch((error)=>{
        dispatch(authSlice.actions.loginFailed(error.response.data.message));
    });
};
export const logout =()=>async(dispatch)=>{
    dispatch(authSlice.actions.logoutRequest());
    await axios.get("http://localhost:4000/api/v1/auth/logout", {
        withCredentials:true,
        headers:{
            "content-Type":"application/json",
        },


    }).then(res=>{
        dispatch(authSlice.actions.logoutSuccess(res.data.message));
        dispatch(authSlice.actions.resetAuthSlice());
    }).catch((error)=>{
        dispatch(authSlice.actions.logoutFailed(error.response.data.message));
    });
};
export const getUser =()=>async(dispatch)=>{
    dispatch(authSlice.actions.getUserRequest());
    await axios.get("http://localhost:4000/api/v1/auth/me", {
        withCredentials:true,
        headers:{
            "content-Type":"application/json",
        },


    }).then(res=>{
        dispatch(authSlice.actions.getUserSuccess(res.data));
       
    }).catch((error)=>{
        dispatch(authSlice.actions.getUserFailed(error.response.data.message));
    });
};
export const forgotPassword =(email)=>async(dispatch)=>{
    dispatch(authSlice.actions.forgotPasswordRequest());
    await axios.post("http://localhost:4000/api/v1/auth/password/forgot",{email}, {
        withCredentials:true,
        headers:{
            "content-Type":"application/json",
        },


    }).then(res=>{
        dispatch(authSlice.actions.forgotPasswordSuccess(res.data))
    }).catch((error)=>{
        dispatch(authSlice.actions.forgotPasswordFailed(error.response.data.message));
    });
};
export const resetPassword =(data,token)=>async(dispatch)=>{
    dispatch(authSlice.actions.resetPasswordRequest());
    await axios.put(`http://localhost:4000/api/v1/auth/password/reset/${token}`,data, {
        withCredentials:true,
        headers:{
            "content-Type":"application/json",
        },


    }).then(res=>{
        dispatch(authSlice.actions.resetPasswordSuccess(res.data))
    }).catch((error)=>{
        dispatch(authSlice.actions.resetPasswordFailed(error.response.data.message));
    });
};
export const updatePassword =(data)=>async(dispatch)=>{
    dispatch(authSlice.actions.updatePasswordRequest());
    await axios.put(`http://localhost:4000/api/v1/auth/password/update`,data, {
        withCredentials:true,
        headers:{
            "content-Type":"application/json",
        },


    }).then(res=>{
        dispatch(authSlice.actions.updatePasswordSuccess(res.data.message))
    }).catch((error)=>{
        dispatch(authSlice.actions.updatePasswordFailed(error.response.data.message));
    });
};
export default authSlice.reducer;