import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Ecommerse from './Ecommerse';
import ProductInfo from './ProductInfo';
import AddProduct from './AddProduct';
import Category from './Category';
import Login from './login';
import { useContext } from 'react';
import AuthenticationProvider from './AuthProvider';
import { AuthContext } from './AuthProvider';
import ProductPage from './ProductPage';
import Cart from './Cart';
import OrderPage from './Orders';

function PrivateRoute({children, path}){
  const { authenticated } = useContext(AuthContext);
  return authenticated ? children : <Navigate to="/login" state={{redirectTo: path}} />;
}

function App() {
  return (
    <AuthenticationProvider>
    <Routes>
      {/* <Route path="products/all" element={<Ecommerse />} /> */}
      <Route path="/" element={<Ecommerse />} />
      {/* <Route path="/products/:prodId" element={<ProductInfo />} /> */}
      <Route path="/product/:prodId" element={ <ProductPage /> } />
      <Route path="/cart" element={ <PrivateRoute path={ "/cart" }> <Cart/> </PrivateRoute>}/>
      <Route path="/categories/:id"  element={ <Category/> } />
      {/* <Route path="/products/:prodId" element={<AddProduct viewType={"view"}/>} /> this route may be used for edit and delete for admin */}
      <Route path="/products/:prodId" element={<ProductPage />} />
      <Route path="/login" element={ <Login/> } />
      <Route path="/products/add" element={<PrivateRoute path={ "/products/add" }> <AddProduct/> </PrivateRoute>} viewType={"add"} />
      <Route path="/orders" element={ <PrivateRoute path={ "/orders" }> <OrderPage/>  </PrivateRoute> }  />
    </Routes>
    </AuthenticationProvider>
  );
}

export default App;