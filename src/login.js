import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, useNavigate, useLocation } from "react-router-dom";

export default function Login(){
    const { setAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.redirectTo ?? "/";
    async function check(){
        try{
            console.log(document.cookie);
            document.cookie = " Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            const formData = new FormData();
            formData.append("username", "hruthik");
            formData.append("password","hruthik");
            const response = await axios.post("https://users.hruthik-ecommerse-store.com/user/verify",formData,
            {   headers:{
                "Content-Type": "multipart/form-data",
            },
                withCredentials: true});
            console.log(response.status);
            console.log(response.data);
            console.log("these are the document cookies", document.cookie);
            if(response.status === 200){
                setAuthenticated(true);
                navigate(redirectTo);
            }
        }catch(error){
            if(error.response && error.response.status === 401){
                setAuthenticated(false);
            }else{
                console.log("Error has occured while authentication", error);
            }setAuthenticated(false);
        }
    }
    useEffect(()=>{
        check();
    });
    return <>Hello</>;
}