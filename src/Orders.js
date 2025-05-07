import { useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

// trying to trigger jenkins build job from github webhook attempt 1

async function getOrders(setOrdersResp){
    const response = await axios.get("https://users.hruthik-ecommerse-store.com/orders", { withCredentials: true });
        try{
            setOrdersResp(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
}

function RenderOrders(orders){
    let ordersKeys = Object.keys(orders);
    console.log("The order keys: ",ordersKeys);
    return <div className="ordersList">
        <h2>Your Orders</h2>
        {
            ordersKeys.map((orderId)=>{
                let products = orders[orderId].products;
                let totalAmount = products.reduce((total,prod)=> total+prod.amount,0);
                console.log("These are the products: ",products);
                return <div key={orderId} className="orderItem">
                    <div className="orderInfo">
                        <div style={{ padding: "0px", margin: "2px", display: "flex", flexDirection: "column", alignItems: "center", "justifyContent": "center"}}>
                            <div style={{color: "GrayText", marginBottom: '4px'}}> Order Number </div>
                            <div style={{marginBottom: '16px'}}> { orderId } </div>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center", "justifyContent": "center"}}>
                            <div style={{color: "GrayText", marginBottom: '4px'}}> Order Date </div>
                            <div style={{marginBottom: '16px'}}> { orders[orderId].timeAndDate } </div>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center", "justifyContent": "center"}}>
                            <div style={{color: "GrayText", marginBottom: '4px'}}> Total </div>
                            <div style={{marginBottom: '16px'}}> ${totalAmount} </div>
                        </div>
                    </div>
                    <div className="orderItemInfo">
                        {
                            products.map((product)=>{
                                return <div key={product.prod_id} className="orderProductContainer">
                                    <div className="orderImageContainer">
                                        <img src={`data:image/*;base64,${product.imageUrl}`} />
                                    </div>
                                    <div className="orderInfoContainer" style={{ marginBottom: '4px' }}>
                                        <div className="prodInfoContainer">
                                            <div> Product ID: {product.prod_id} </div>
                                            <div> Quantity: {product.quantity} </div>
                                        </div>
                                        <div className="priceContainer">
                                            <div> Price: ${product.amount.toFixed(2)} </div>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
            })
        }
    </div>
}

export default function OrderPage(){

    const [ordersResp, setOrdersResp] = useState([]);
    const [orders,setOrders] = useState([]);    
    useEffect(()=>{
        getOrders(setOrdersResp);
    },[])
    
    useEffect(()=>{
        console.log(ordersResp);
        RenderOrders(ordersResp);
    },[ordersResp])

    return <div>
        <Navbar/> 
        { 
        RenderOrders(ordersResp) }
    </div>

}