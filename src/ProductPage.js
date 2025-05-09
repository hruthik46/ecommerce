import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaShoppingCart } from "react-icons/fa";
//import { ProductCard } from "./Ecommerse";

export default function Product() {
    const { prodId } = useParams();
    const [product, setProduct] = useState({});
    const [selectedVariant, setSelectedVariant] = useState({});
    const [activeId, setActiveId] = useState();
    const [quantity, setQuantity] = useState(1);
    const [cartStatus, setCartStatus] = useState(false);

    const [cartMap, setCartMap] = useState({});
    const [cookie,setCookie] = useState(document.cookie);

    function parseCartCookie(){
        let tempMap = {};
        console.log("fgafgfgafbgjasbfajsfbakhsbafsbkghfbskghabgkhbfghkafgkafb");
        console.log(document.cookie);
        if(cookie){
            let cartList = cookie.split("; ");
            cartList.map((item)=>{
            if(!item.includes("undefined")){
                const itemInfo = item.split("=");
                let key = parseInt(itemInfo[0].split("_")[1],10)
                if(itemInfo[0].split("_")[0]==="Cart"){
                  tempMap[key] = parseInt(itemInfo[1],10)
                }
            }
        });
        console.log("This is temp map",tempMap);
    }setCartMap(tempMap);
    }

    useEffect(()=>{
        parseCartCookie();
    },[cookie])

    async function getProduct() {
        const response = await axios.get(`https://products.hruthik-ecommerse-store.com/products/${prodId}`);
        let tempQuantity = quantity;
        
        if (response.status === 200) {
            setProduct(response.data);
            setSelectedVariant(response.data.prodVariants[0]);
            setActiveId(response.data.prodVariants[0].variantId);
            console.log("this is initial variant id: ",response.data.prodVariants[0].variantId);
            let prodKeys = Object.keys(cartMap);
            console.log("Hello this is very important: ",prodKeys,typeof(parseInt(prodId, 10)));
            if(prodKeys.length > 0){
                let resp = prodKeys.find((prodKey)=>{
                    if(parseInt(prodKey,10) === parseInt(prodId, 10)){
                        console.log("Hello this is very important holla: ",prodKeys,parseInt(prodId, 10),prodKey);
                    }
                    return parseInt(prodKey,10) === parseInt(prodId, 10)});
                if(resp !== undefined){
                    tempQuantity = cartMap[resp];
                    setCartStatus(true);
                }
            }
            setQuantity(tempQuantity);
        }
    }

    function updateQuantity(prodId, quantity){
        document.cookie = `Cart_${prodId}=${quantity}; path=/; domain=.hruthik-ecommerse-store.com; Secure; SameSite=None`;
        console.log("Cookies after update quantity: ",document.cookie);
        setCookie(`${document.cookie}`);
        setCartMap((prevCartMap)=> { 
            return { ...prevCartMap, [prodId]: quantity };
         })
    }
    
    useEffect(() => {
        getProduct();
    }, [prodId,cartMap]);

    function handleVariantChange(variantId){
        setSelectedVariant(product.prodVariants.find((variant)=> variant.variantId === variantId));
        setActiveId(variantId);
    }

    console.log(product.prodVariants);
    return (
        <div className="productPageLayout">
            <Navbar />
            <div className="productInfoContainer">
                <div className="productImageContainer">
                    <img src={`data:image/*;base64,${product.image}`} alt="Product" />
                </div>
                <div className="productTextDetailsContainer">
                    <div>
                            <div className="productInfoName">{product.prodName}</div>
                            <div className="productInfoDescription">{product.description}</div>
                            <div className="releaseDateInfo">Release Date: {product.releaseDate}</div>
                            <div style={{marginTop: '16px'}}>
                                    <p className="rateInfo">
                                    <span className="discountedPriceInfo" style={{fontSize: "24px", color: "black"}}>${(selectedVariant.price - (selectedVariant.discountPercentage / 100) * selectedVariant.price).toFixed(2)}</span>
                                    <span className="actualPriceInfo"  >${selectedVariant.price}</span>
                                    <span className="discountPercentageInfo"  >({selectedVariant.discountPercentage}% OFF)</span>
                                    </p>
                            </div>
                    </div>
                    <div>
                        <div className="variantsStyle">
                            { 
                            product.prodVariants?.map((variant)=>{
                                return <div key={variant.variantId} onClick={()=>handleVariantChange(variant.variantId)} className={activeId === variant.variantId ? "activeVariantStyle" : "variantStyle"}> { variant.size } </div>
                            })
                            }
                        </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',maxWidth: 'max-content'}}>
                                <div className="quantityControls">
                                <button 
                                    style={{fontSize:"24px"}}
                                    onClick={() => 
                                        {
                                            updateQuantity(product.prodId, quantity - 1);
                                            setQuantity((prevQuantity)=> {
                                                if(prevQuantity - 1 >= 1){
                                                    return prevQuantity - 1;
                                                }return prevQuantity;
                                            });
                                        }
                                    }
                                    disabled={quantity <= 1} // Disable if quantity is 1
                                >
                                    -
                                </button>
                                <span className="quantity">{quantity}</span>
                                <button
                                    style={{fontSize:"24px"}}
                                    disabled = { quantity > product.stock }
                                    onClick={() => 
                                    {
                                        updateQuantity(product.prodId, quantity + 1);
                                        setQuantity((prevQuantity)=> {
                                            if(prevQuantity < selectedVariant.stock){
                                                return prevQuantity + 1;
                                            }return prevQuantity;
                                        });
                                    }
                                    }
                                >
                                    +
                                </button>
                                </div>
                                <button className="addToCart"
                                onClick={()=>{
                                    // anyways this button click will only be active when this product is not in cart, so as soon as we hit the button we update the quantity to 1.
                                    if(!cartStatus){
                                        updateQuantity(product.prodId, 1);
                                    }
                                }}
                                >{ cartStatus ? "ADDED TO CART" : "ADD TO CART" }</button>
                    </div>
                </div>
            </div>
            <div className="recommendedSection">
                <div className="productInfoName" style={{marginTop: '30px'}}> Customers also bought </div>
                <RecommendedProducts prodId={prodId}/>
            </div>
        </div>
    );
}

function RecommendedProducts({prodId}){
    const navigate = useNavigate();
    const [recProds, setRecProds] = useState([]);
    const [cartMap, setCartMap] = useState({});
    const [cookie,setCookie] = useState("");

    function parseCartCookie(){
        let tempMap = {};
        console.log(document.cookie);
        if(cookie){
            let cartList = cookie.split("; ");
            cartList.map((item)=>{
            if(!item.includes("undefined")){
                const itemInfo = item.split("=");
                let key = parseInt(itemInfo[0].split("_")[1],10)
                if(itemInfo[0].split("_")[0]==="Cart"){
                  tempMap[key] = parseInt(itemInfo[1],10)
                }
            }
        });
    }setCartMap(tempMap);
    }

    useEffect(()=>{
        //setCookie(document.cookie)
        parseCartCookie();
    },[cookie])

    async function getRecommendedProds(){
        const response = await axios.get(`https://users.hruthik-ecommerse-store.com/getRecommendations/${prodId}`,{withCredentials: true});
        console.log("These are the recommended Products finalized: ",response.data);
        setRecProds(response.data);
    }

    useEffect(()=>{
        getRecommendedProds();
    },[prodId])

    return <div className="categoryProducts">
        { recProds.map((prod)=>{
            return <div key={prod.prodId} onClick={()=>{
                navigate(`/products/${prod.prodId}`, { state: { prodId: prod.prodId } });
            }}>
                <ProductCard prodInfo={prod}  cartInfo={cartMap} setCookie={setCookie}/>
            </div>
        }) }
    </div>

}

function ProductCard({prodInfo, cartInfo, setCookie}){
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