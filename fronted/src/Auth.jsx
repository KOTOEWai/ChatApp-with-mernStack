/* eslint-disable react/prop-types */
import { createContext, useEffect,useReducer } from "react";
import axios from "axios";

const AuthContext = createContext();
const Reducer= (state,action) => {
    switch(action.type){
        case 'LOGIN':
            return {user:action.payload};
        case 'LOGOUT':
            return { user:null};
        default:
            return state;
    }
}
const AuthProvider = ({children}) =>{
   const [state,dispatch] = useReducer(Reducer,{
    user:null
   })
useEffect(() => {
        axios.get('http://localhost:3000/user/secure/',{
            withCredentials:true
        }).then((res)=>{
            if(res.data){
                dispatch({type:'LOGIN',payload:res.data});
            }else{
                dispatch({type:'LOGOUT'});
            }
        }).catch((err)=>{
            if(err.response && err.response.statusCode === 401){
                console.log(err.response)
                dispatch({type:'LOGOUT'});
            }
        })
})
useEffect(()=>{
    if(state.user){
        localStorage.setItem('user', JSON.stringify(state.user));

    }else{
        localStorage.removeItem('user');
    }
},[state.user]);
    return (
        <AuthContext.Provider value={{...state,dispatch}} >
            {children}
        </AuthContext.Provider>
    )

}

export {AuthContext,AuthProvider};