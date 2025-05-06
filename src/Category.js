import React, { useState, useEffect, useRef } from "react";
import './App.css';
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { FaShoppingCart } from "react-icons/fa";
import { ProductCard } from "./Ecommerse";

export default function Category(){
    const { id } = useParams();
    const [category, setCategory] = useState();
    const [cookie,setCookie] = useState(``);
    const [cartMap, setCartMap] = useState({});
    const navigate = useNavigate();

    useEffect(()=>{
        async function getProductsByCat(){
            await fetch(`https://category.hruthik-ecommerse-store.com/categories/${id}`).then((res)=>  res.json()).then((res)=> setCategory(res));
        }
        getProductsByCat();
        setCookie(`${document.cookie}`);
    },[id]);

    useEffect(()=>{
        function extractCartItems(){
            let tempMap = {};
            if(cookie){
                let cookies = cookie.split("; ");
                cookies.map((cookie) => {
                    let key = parseInt( cookie.split("=")[0].split("_")[1] , 10);
                    if(cookie.split("=")[0].split("_")[0] === "Cart"){
                        tempMap[key] = parseInt(cookie.split("=")[1], 10);
                    }
                })
            }
            setCartMap(tempMap);
        }
        extractCartItems();
    },[cookie]);

    return <div>
        <Navbar/>
        <div>
            {category &&
                 <div className="categoryProducts">
                    { category.products.map((product)=>
                    <div key={product.prodId} onClick={()=>{
                        navigate(`/products/${product.prodId}`, { state: { prodId: product.prodId } });
                    }}>
                    <ProductCard prodInfo={product} cartInfo={cartMap} setCookie={setCookie} />
                    </div>
                    ) }
                </div> }
        </div>
    </div>
}