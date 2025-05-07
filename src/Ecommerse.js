import React, { useState, useEffect, useRef } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import './App.css';
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";

// this line is just added so that i can push something into the repo and check if the jenkins build is getting triggered.
// first trigger failed so trying again by adding a new line.
// trying another time for jenkins trigger attempt 3

export default function Ecommerse(){
    const navigate = useNavigate();
    //const [loading, setLoading] = useState(true);
    //const [error,setError] = useState(null);
    const [cookie,setCookie] = useState(``);
    const [cartMap, setCartMap] = useState({});
    const [categories, setCategories] = useState([]);
    const [page,setPage] = useState(0);
    const [data, setData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState([]);
    const scrollRef = useRef([]);

    async function fetchData(){
        let categoriesRes = await fetch(`https://category.hruthik-ecommerse-store.com/categories/all/${page}`).then((res)=>res.json());
        categoriesRes = categoriesRes.filter((category)=> category.products.length > 0 )
        setCategories((prevCategories) => [ ...prevCategories, ...categoriesRes]);
        setCurrentIndex(new Array(categoriesRes.length).fill(2));
        //scrollRef.current = categoriesRes.map(()=>[]);
        scrollRef.current = [...scrollRef.current, ...categoriesRes.map(() => [])];
    };

    useEffect(()=>{
       setCookie(`${document.cookie}`);
       //fetchData();
    },[]);

    useEffect(()=>{
        fetchData();
    },[page])

    function handleScrollContent(){
        const scrollToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
        if(scrollToBottom){
            setPage((prevPage)=> prevPage + 1);
        }
    }

    useEffect(()=>{
        window.addEventListener("scroll",handleScrollContent);
        return () => window.removeEventListener("scroll", handleScrollContent);
    },[])

    useEffect(()=>{
        function extractCartItems(){
            let tempMap = {};
            if(cookie){
                console.log("Initial Cookies or extracting updated cookies: ",document.cookie);
                let cartList = cookie.split("; ");
                cartList.map((item)=>{
                if(!item.includes("undefined")){
                    const itemInfo = item.split("=");
                    let key = parseInt(itemInfo[0].split("_")[1],10)
                    if(itemInfo[0].split("_")[0] === "Cart"){
                        tempMap[key] = parseInt(itemInfo[1],10);
                    }
            }});setCartMap(tempMap);}}
        extractCartItems();
    },[cookie]);

    function handleScroll(index, direction, catIndex){
        let nextIndex = direction === "next" ? index + 1 : index - 1;
        if(!scrollRef.current[catIndex][nextIndex] || nextIndex >= scrollRef.current[catIndex].length-1 || nextIndex <= 1){
            console.log("resetting");
            nextIndex = 1;
        }
        setCurrentIndex((prevState)=>{
            return prevState.map((ele,index)=>{
                if(index===catIndex){
                    return nextIndex;
                }return ele;
            })
        });
        if(scrollRef.current[catIndex] && scrollRef.current[catIndex][nextIndex]){
            scrollRef.current[catIndex][nextIndex].scrollIntoView({behavior: "smooth", block: "nearest", inline: "center"});
        }
    }
    function mapItems(){
        return categories.map((category, catIndex)=>{
           return <div key={ catIndex } style={{ width: '100%', display:'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'flex-start'}}>
                <div style={{width: '100%', display: 'flex', flexDirection: 'row',alignItems: 'center' ,justifyContent: 'space-between'}}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <button className="scroll-btn left" onClick={()=>handleScroll(currentIndex[catIndex],"prev",catIndex)}><FiChevronLeft size={30}/></button>
                        <div className="categoryName"> <p>{category.categoryName}</p> </div>
                    </div>
                        <button className="scroll-btn right" onClick={()=>handleScroll(currentIndex[catIndex],"next",catIndex)}><FiChevronRight size={30}/></button>
                </div>
                <div className="categoryView">{
                category.products.map((product,prodIndex)=>{
                return <div ref={(eleRef)=>{
                    if(!scrollRef.current[catIndex]){
                        scrollRef.current[catIndex] = [];
                    }
                    scrollRef.current[catIndex][prodIndex] = eleRef 
                }} key={product.prodId} onClick={()=>{
                    console.log("Hello you are clicking");
                    navigate(`/products/${product.prodId}`, { state: { prodId: product.prodId } });
                }}>
                    <ProductCard prodInfo={product} cartInfo={cartMap} setCookie={setCookie}/>
                </div>; 
                    })
                }</div></div>;
                })
            }

    const productUi1 = mapItems(categories);
    return <>
        <Navbar/>
        <div className="allProductsView">
            {productUi1}
        </div>
    </>;
    }

export function ProductCard({prodInfo, cartInfo, setCookie}){
    console.log(prodInfo, cartInfo);
    async function saveItem(prodId){
        // const cartResponse = await axios.get(`http://localhost:8083/user/save/${prodId}`, {withCredentials: true});
        console.log("logging variant id: ",prodInfo);
        const cartResponse = await axios.post(`https://users.hruthik-ecommerse-store.com/user/save`,
             { 
                "prodId": prodId,
                "variantId": prodInfo.variantId,
                }, {withCredentials: true});
            console.log(cartResponse.data);
            console.log(cartResponse.status);
        setCookie(document.cookie);
    }

    return <div className="productContainer">
           <div className="imageContainer">
                <img src={`data:image/*;base64,${prodInfo.image}`} alt={prodInfo.prodName} style={{width: '100%', height: '100%'}} />
            </div>
            <div className="productDetailsContainer" style={{justifyContent: 'space-between'}}>
                <div>
                    <p className="productName"> {prodInfo.prodName} </p>
                    <p className="productSize" style={{ fontSize: '14px', color: 'gray' }}> {prodInfo.size} </p>
                    <div className="stock-info">In Stock: {prodInfo.stock} </div>
                    <p className="productDescription" style={{fontWeight:200}}> {prodInfo.description} </p>
                </div>
                <div style={{marginBottom: '8px', display:'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <p className="rateInfo">
                    <span className="discountedPriceInfo">${(prodInfo.price - (prodInfo.discountPercentage / 100) * prodInfo.price).toFixed(2)}</span>
                    <span className="actualPriceInfo">${prodInfo.price}</span>
                    <span className="discountPercentageInfo">({prodInfo.discountPercentage}% OFF)</span>
                </p>
                    <div className="customButton" key={prodInfo.prodId} onClick={ (e) => 
                    {   saveItem(prodInfo.prodId); 
                        e.stopPropagation();}
                        } >
                        { cartInfo[prodInfo.prodId] ? <div style={{ fontSize: '20px', paddingLeft: '4px', paddingRight: '4px' }}> {cartInfo[prodInfo.prodId]} </div> : <FaShoppingCart size={20} /> }
                    </div>
                </div>
            </div>
        </div>;
}