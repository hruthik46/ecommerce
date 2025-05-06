import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import moment from 'moment';
import shoppingImage from "./shopping.png";

export default function Cart(){

    const generatorSpace = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
    const [productData,setProductData] = useState([]);
    const [cookie, setCookie] = useState(`${document.cookie}`);
    const [cartMap, setCartMap] = useState({});
    const prodIds = useRef([]);
    //const priceMap = useRef({});
    const [priceMap, setPriceMap] = useState({});
    const catDisc = useRef({});
    const orderId = useRef("");
    const prodToVariant = useRef({});
    const [prodIdToVariantId, setProdIdToVariantId] = useState({});
    //const checked = useRef(false);
    const [checked, setChecked] = useState(false);

    function clearCart(){
      if(cookie){
        console.log("deleting all Cookies");
        let cartList = cookie.split("; ");
        cartList.map((cartItem)=>{
          const itemInfo = cartItem.split("=")
          document.cookie = `${itemInfo[0]}=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.hruthik-ecommerse-store.com; Secure; SameSite=None`
        })
        setCookie(``);
        setCartMap({});
      }
    }

    async function recordCatDisc(){
      await fetch("https://category.hruthik-ecommerse-store.com/categories/all", {credentials: 'include'} ).then((res)=>res.json()).then(
        (res)=>{
          console.log(res);
          res.map((category)=>{
            catDisc.current = { ...catDisc.current, [category.id]: category.discountPercentage }
          })
        });

    }

    async function extractCartItems(){
        let tempMap = {};
        prodIds.current = [];
        console.log("ehllo")
        console.log(document.cookie);
        if(cookie){
          console.log("ehllo")
            console.log("Initial Cookies or extracting updated cookies: ",document.cookie);
            let cartList = cookie.split("; ");
            cartList.map((item)=>{
            if(!item.includes("undefined")){
                const itemInfo = item.split("=");
                let key = parseInt(itemInfo[0].split("_")[1],10)
                if(itemInfo[0].split("_")[0]==="Cart"){
                  prodIds.current = [ ...prodIds.current, key ]
                  tempMap[key] = parseInt(itemInfo[1],10)
                }
                if(itemInfo[0].split("_")[0]==="Variant"){
                  prodToVariant.current = { ...prodToVariant.current, [key]: parseInt(itemInfo[1],10) };
                  //setProdIdToVariantId((prevState)=> ({ ...prevState, [key]: parseInt(itemInfo[1],10)  }))
                }
            }
        });
        setCartMap(tempMap);
        setProdIdToVariantId(prodToVariant.current);
        }
    }

    function initPriceMap(){
      let keys = prodIdToVariantId != {} ? Object.keys(prodIdToVariantId) : Object.keys(prodToVariant.current);
      console.log("This is the keys: ",keys);
      let tempPriceMap = {};
      console.log("Hello this is the product data: ",productData);
      if(productData.length > 0 && Object.keys(prodIdToVariantId).length > 0){
        console.log("This is the prodIdToVariantId: ",prodIdToVariantId);
      console.log("This is the prodToVariant: ",prodToVariant);
      console.log("this is the productData: ",productData);
        keys.map((key)=>{
          let amount = 0;
          key = parseInt(key.split("_")[0],10);
          let selectedVariantId = prodIdToVariantId[key];
          let selectedProduct = productData?.find((product)=> product.prodId === key);
          let selectedVariant = selectedProduct?.prodVariants?.find((variant)=> variant.variantId === selectedVariantId);
          let quantity = cartMap[selectedProduct?.prodId];
          console.log("SelectedVariantId: ", selectedVariantId, " selectedVariant: ", selectedVariant, " selectedProduct: " , selectedProduct);
          if(selectedVariant.discountPercentage === 0){
            //amount = ((selectedVariant.price - (catDisc.current[selectedProduct.categoryId] / 100) * selectedVariant.price) * quantity).toFixed(2);
            amount = (selectedVariant.price * quantity).toFixed(2);
          }else{
            amount = ((selectedVariant.price - (selectedVariant.discountPercentage / 100) * selectedVariant.price) * quantity).toFixed(2);
          }
          tempPriceMap = { ...tempPriceMap, [selectedProduct.prodId]: amount }
        })
      }
      setPriceMap(tempPriceMap);
    }

    function updateQuantity(prodId, quantity){
        document.cookie = `Cart_${prodId}=${quantity}; path=/; domain=.hruthik-ecommerse-store.com; Secure; SameSite=None`;
        console.log("Cookies after update quantity: ",document.cookie);
        setCookie(`${document.cookie}`);
        setCartMap((prevCartMap)=> { 
            return { ...prevCartMap, [prodId]: quantity };
         })
    }

    function generateId(){
      let id = "";
      for(let i=0;i<10;i++){
        let index = Math.floor(Math.random() * generatorSpace.length);
        id += generatorSpace[index];
      }
      orderId.current = id;
      return id;
    }

    async function finalizeId(){
      while(1){
        let newId = generateId();
        const res = await axios.get(`https://users.hruthik-ecommerse-store.com/orders/boolean/${newId}`,{withCredentials: true});
        if(res.status === 200){
          orderId.current = newId;
          break;
        }else{
          console.log("Error Occured");
        }
    }
  }

    useEffect(()=>{
      console.log("Recording Category Discount and generating order id.");
      if(!checked){
        setChecked(true);
        finalizeId();
      }
      recordCatDisc();
    },[])

    useEffect(()=>{
      console.log("We are resetting the cookie values and cart af");
      extractCartItems();
    },[cookie]);

    useEffect(()=>{
        console.log("fetching products again from the endpoints");
        getCartItems();
        initPriceMap();
    },[cartMap]);

    useEffect(()=>{
      initPriceMap();
  },[cartMap, prodIdToVariantId, productData]);

   async function getCartItems(){
        console.log("We are resetting the valueaf");
        if(prodIds.current.length > productData.length){
            try{
                const responses = await Promise.all(
                    prodIds.current.map((id)=> axios.get(`https://products.hruthik-ecommerse-store.com/products/${id}`,{withCredentials: true}))
                )
                const products = responses.map((res)=>res.data);
                setProductData(products);
            }catch(err){
                console.log(err);
            }
        }
        if(prodIds.current.length === 0){
          setProductData([]);
        }
    }
    function cartItemsRender() {
        console.log(productData)
        return (
          <div className="itemSummary">
            {productData.map((cartItem) => {
              const quantity = cartMap[cartItem.prodId]; // Get quantity from cartMap
              return (
                <div className="itemStyle" key={cartItem.prodId}>
                  <div className="cartItemImageContainer">
                    <img src={`data:image/*;base64,${cartItem.image}`} alt={cartItem.prodName} />
                  </div>
                  <div className="cartItemInfoContainer">
                    <div className="productName">{cartItem.prodName}</div>
                    <div className="productDescription">{cartItem.description}</div>
                    <div className="productPrice">
                      ${priceMap[cartItem.prodId]}
                    </div>
                    <div className="quantityControls">
                      <button 
                        onClick={() => 
                            {
                                updateQuantity(cartItem.prodId, quantity - 1);
                            }
                        }
                        disabled={quantity <= 1} // Disable if quantity is 1
                      >
                        -
                      </button>
                      <span className="quantity">{quantity}</span>
                      <button
                        disabled = { quantity > cartItem.quantity }
                        onClick={() => updateQuantity(cartItem.prodId, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

      function paymentSummary() {
        return (
          <div className="paymentSummary">
            <h2>Payment Summary</h2>
            <div className="paymentContainer">
              {productData.map((product) => (
                <div className="paymentItem" key={product.prodId}>
                  <div className="productName"> 
                    {product.prodName} <span className="quantity"> x {cartMap[product.prodId]}</span>
                  </div>
                  <div className="price"> 
                    {/* ${((product.price - (product.discountPercentage / 100) * product.price) * cartMap[product.prodId]).toFixed(2)}  */}
                    ${priceMap[product.prodId]}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={async ()=>{
              let currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                console.log("This is the priceMap: ",priceMap);
                console.log("This is category discount map: ", catDisc);
                console.log("These are the products saved: ",prodIds.current);
                console.log("This is the order id", orderId.current);
                prodIds.current.map((prodId)=>{
                axios.post('https://users.hruthik-ecommerse-store.com/orders/add',{
                  "orderId": orderId.current,
                  "prod_id": prodId,
                  "quantity": cartMap[prodId],
                  //"amount": priceMap.current[prodId],
                  "amount": priceMap[prodId],
                  "timeAndDate": `${currentDateTime}`,
                  "variantId": prodIdToVariantId[prodId]
                },
                {
                  withCredentials: true,
                  headers: {
                    "Content-Type": "application/json"
                  }
                }
              ).then((response)=>{
                console.log(response.status);
                //alert("Order has been successfully placed!!!");
              }).catch((err)=>{console.log("logging error: ", err)}).finally(()=>{ clearCart(); });
              })
              // Promise.all(
              //   prodIds.current.map((prodId)=>{
              //     axios.post('http://localhost:8083/orders/add',{
              //       "prod_id": `${prodId}`,
              //       "quantity": cartMap[prodId],
              //       "amount": priceMap.current[prodId],
              //       "timeAndDate": `${currentDateTime}`
              //     },
              //     {
              //       withCredentials: true
              //     }
              //   )
              //   })
              // ).then((responses)=>{
              //   if(responses.every(res => res.status === 200)){
              //     console.log("Order items logged successfully");
              //     clearCart();
              //     alert("Order has been successfully placed!!!");
              //   }else{
              //     console.log("Some items failed to log.");
              //   }
              // }).catch((error)=>{
              //   console.error("Error logging order items:");
              // })
            }} className="checkoutButton">Checkout</button>
          </div>
        );}
    
    function emptyCartRender(){
      return <div className="emptyCart">
        <img src={shoppingImage} width={300} height={300}/>
        <h2>YOUR CART IS CURRENTLY EMPTY!</h2>
        <h6>Looks like you have not made your choices yet.</h6>
      </div>
    }

    return <div>
      <Navbar/>
      { productData.length === 0 ? emptyCartRender() : 
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "center"}}>
      <div style={{ flex: 1, overflowY: "auto", maxHeight: "80vh" }}>
          {cartItemsRender()}
      </div>
      <div className="paymentSummary">
          { paymentSummary() }
      </div>
    </div>
      }
    </div>
}