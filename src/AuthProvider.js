import axios from "axios";
import { createContext, useEffect } from "react";
import { useState } from "react";
export let AuthContext = createContext();

export default function AuthenticationProvider({children}){

    const [authenticated, setAuthenticated] = useState(false);
    async function verifyLogin(){
        try{
        const response = await axios.get("https://users.hruthik-ecommerse-store.com/user/isLoggedIn",{withCredentials: true});
        if(response.status === 200){
            setAuthenticated(true);
        }
    }catch(error){
        if(error.response && error.response.status === 401){
            setAuthenticated(false);
        }else{
            console.log("Error occured while authentication",error);
            setAuthenticated(false);
        }
    }
}
    useEffect(()=>{
        verifyLogin();
    });
    return <AuthContext.Provider value={{authenticated, setAuthenticated}}>
        {children}
    </AuthContext.Provider>;

}