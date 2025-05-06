import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import DropDown from './DropDown';
import { BiCloudUpload } from 'react-icons/bi';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AddProduct({viewType}) {
  const { prodId } = useParams();
  const [product, setProduct] = useState({
    image: '',
    prodName: '',
    price: '',
    description: '',
    categoryId: 0,
    discountPercentage: '',
    size: '',
    quantity: '',
    releaseDate: ''
  });
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState();

  useEffect(()=>{
    async function getCategories(){
        await fetch("https://category.hruthik-ecommerse-store.com/categories/all").then((res)=>res.json()).then((res)=>setCategories(res));
    }
    async function getProduct(){
      const productResponse = await fetch(`https://products.hruthik-ecommerse-store.com/products/${prodId}`).then((res)=>res.json());
      setProduct(productResponse);
      setPreview(`data:image/jpeg;base64,${productResponse.image}`);
    }
    viewType === "view" ? getProduct() : getCategories();   
},[prodId, viewType]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (file) => {
    if (file) {
      setProduct({ ...product, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productDTO = {
        prodName: product.prodName,
        price: product.price,
        description: product.description,
        categoryId: parseInt(product.categoryId),
        discountPercentage: product.discountPercentage,
        quantity: product.quantity,
        size: product.size,
        releaseDate: product.releaseDate,
      };
      
    const formData = new FormData();
    formData.append('productDTO', new Blob([JSON.stringify(productDTO)], { type: 'application/json' }));
    formData.append('image', product.image);
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
    try {
      const response = await axios.post('https://products.hruthik-ecommerse-store.com/products/add', formData);
      console.log(response.data);
      alert('Product added successfully!');
      setProduct(()=>({
        image: '',
        prodName: '',
        price: '',
        description: '',
        categoryId: '',
        size: '',
        discountPercentage: '', 
        quantity: '',
        releaseDate: ''
      }));
      setPreview(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload product.');
    }
  };
  return <div>
    <Navbar/>
        <div className='addView'>
        <div className={`uploadImage ${dragging ? "dragging" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
    <label htmlFor="imageUpload" className="uploadLabel">
        {preview ? ( <img src={preview} alt="Preview" className="previewImage" />) : (
            <div className="uploadContent">
                <BiCloudUpload size={50} color="#4CAF50" />
                <p>Click or Drag & Drop to Upload</p>
            </div>
        )} 
    </label>
    <input type="file" id="imageUpload" accept="image/*" onChange={handleFileSelect} hidden />
</div>
<form onSubmit={handleSubmit} style={{ margin: '', justifyContent:'start', alignItems: 'start' }}>
    <div className='inputStyle'>
        <label htmlFor="prodName">Product Name:</label><br />
        {viewType === "view" ? <span>{product.prodName}</span>
         : <input value={product.prodName} placeholder="ex: laptop" id="prodName" name="prodName" className="inputStyle" onChange={handleChange} />
        }
            </div>
    <div className="inputStyle">
        <label htmlFor="description">Description:</label><br />
        <input value={product.description} placeholder="ex: This is a 14-inch laptop" name="description" className="inputStyle" onChange={handleChange} />
    </div>
    <div className="inputStyle">
        <DropDown product={product} setProduct={setProduct}/>
    </div>
    <div className="inputStyle">
        <label htmlFor="size">Denominations Available:</label><br />
        <input value={product.size !== "" ? product.size : ""} placeholder="ex: 10" name="size" className="inputStyle" onChange={handleChange} />
    </div>
    <div className="inputStyle">
        <label htmlFor="price">Price:</label><br />
        <input value={product.price !== "" ? product.price : ""} placeholder="ex: $4000" name="price" className="inputStyle" onChange={handleChange} />
    </div>
    <div className="inputStyle">
        <label htmlFor="discountPercentage">Discount in Percentage:</label><br />
        <input value={product.discountPercentage !== "" ? product.discountPercentage : ""} placeholder="ex: 20" name="discountPercentage" className="inputStyle" onChange={handleChange} />
    </div>
    <div className="inputStyle">
        <label htmlFor="quantity">Stock Available:</label><br />
        <input value={product.quantity !== "" ? product.quantity : ""} placeholder="ex: 10" name="quantity" className="inputStyle" onChange={handleChange} />
    </div>
    <div className="inputStyle">
        <label htmlFor="releaseDate">Release Date:</label><br />
        <input value={product.releaseDate} placeholder="format: mm-dd-yyyy" name="releaseDate" className="inputStyle" onChange={handleChange} />
    </div>
    <div className='inputStyle'>
        <button className="btn" type="submit">Add Product</button>
    </div>
    </form>
  </div></div>;
}
export default AddProduct;