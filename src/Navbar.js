import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./App.css"; // or import "./Navbar.css" if you separate styles

export default function Navbar() {
  const location = useLocation();
  const pathName = location.pathname;
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(()=>{
    async function getProducts(){
        await fetch("https://products.hruthik-ecommerse-store.com/products/dashboardProducts").then((res)=>res.json()).then((res)=>{setProducts(res); setSearchedProducts(res)});
    }
    async function getCategories(){
      await fetch("https://category.hruthik-ecommerse-store.com/categories/all").then((res)=>res.json()).then((res)=>{console.log(res);setCategories(res); });
    }
    getProducts();
    getCategories();
  },[])

  useEffect(()=>{
    setSearchedProducts((prevState)=>{
      return products.filter((product)=>product.prod_name.toLowerCase().includes(searchText.toLowerCase()));
    })
    console.log(searchedProducts);
  },[searchText]);

  return ( <div style={{display: 'flex', flexDirection: 'column', width: '100vw', padding:'4px', color: 'white', backgroundColor: 'white'}}>
    <nav className="navbar">
      <div className="searchContainer">
              <div className="searchInput">
                  <input placeholder="Search" onChange={(e) => setSearchText(e.target.value)}/>
              </div>
              { searchText && ( <div className="searchDropDown">
                {searchedProducts.length > 0 ? (
              searchedProducts.map((product) => (
                <div key={product.prod_id}
                onClick={(e)=>{
                  e.stopPropagation();
                  console.log(product);
                  navigate(`/products/${product.prod_id}`);
                }}
                className="searchItem">
                  <p style={{color: 'black'}}>{product.prod_name}</p>
                </div>
              ))
            ) : (
              <p className="noResults">No results found</p>
            )}
              </div> ) }
      </div>
      <div
          className="navbarElement"
          onClick={() => navigate("/")}
        >
          <p style={pathName === "/" ? { color: "white" } : { color: "rgba(255,255,255,0.8)" }}>
            Home
          </p>
        </div>
        <div
          className="navbarElement"
          onClick={() => navigate("/products/add")}>
          <p style={pathName === "/products/add" ? { color: "white" } : { color: "rgba(255,255,255,0.8)" }}>
            Add Product
          </p>
        </div>
        <div
          className="navbarElement"
          onClick={() => navigate("/Cart")}
        >
          <p style={pathName === "/Cart" ? { color: "white" } : { color: "rgba(255,255,255,0.8)" }}>
            Cart
          </p>
        </div>
        <div
          className="navbarElement"
          onClick={() => navigate("/orders")}
        >
          <p style={pathName === "/orders" ? { color: "white" } : { color: "rgba(255,255,255,0.8)" }}>
            Orders
          </p>
        </div>
    </nav>
    <div className="categoryScrollBar">
      {
        categories.map((category)=>{
          return <div key={category.id} onClick={()=>navigate(`/categories/${category.id}`)}>
              <p>{ category.categoryName }</p>
          </div>
        })
      }
    </div>
    </div>
  );
}