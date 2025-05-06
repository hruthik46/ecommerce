import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export default function ProductInfo(){
    const { prodId } = useParams();
    //const location = useLocation();
    //const prodId = location.state?.prodId;
    const [product, setProduct] = useState(null);
    useEffect(()=>{
        async function getProduct(){
            await fetch(`https://products.hruthik-ecommerse-store.com/products/${prodId}`).then((res)=>res.json()).then((res)=>setProduct(res)).catch((err)=>{});
        }
        getProduct();
    },[prodId]);
    console.log("hello");
    console.log(product);
    return product!=null ? <div className="prodLayout">
        <ProductCard prodProp={product} />
    </div> : <p>Loading...</p>;
}

function ProductCard({prodProp}){
    console.log(prodProp.image);
    return <div id={prodProp.id} className='productAxis'>
        <div className='prodImgContainer'><img src={`data:image/png;base64,${prodProp.image}`}><p>Hello</p></img></div>
        <div className='prodInfoContainer' style={{justifyContent: 'space-between'}}>
            <div>
            <p className='productText'>{prodProp.prodName}</p>
            <p className='productText' style={{fontWeight: 300}}>{prodProp.description}</p>
            <p> In Stock: {prodProp.quantity} </p>
            </div>
            <div>
            <p>${prodProp.price}</p></div>
        </div>
    </div>;

}