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
   },



});


export const register =(data)=>async(dispatch)=>{
    dispatch(authSlice.actions.registerRequest());
    await axios.post("",data, {
        withCredentials:true,
        headers:{
            "content-Type":"application/json",
        },


    }).then(res=>{
        dispatch(authSlice.actions.registerSuccess(res.data))
    }).catch(error=>{
        dispatch(authSlice.actions.registerFailed(error.response.data.message));
    });
}