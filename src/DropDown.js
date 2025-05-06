import { useEffect, useState, useRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function DropDown({ product, setProduct }) {
    const [categories, setCategories] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const categoryName = useRef("");

    useEffect(() => {
        async function getCategories() {
            try {
                const response = await fetch("https://category.hruthik-ecommerse-store.com/categories/all");
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                console.log(err);
            }
        }
        getCategories();
    }, []);

    function handleClick() {
        setIsActive((prevState) => !prevState);
    }

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '390px' }}>
            <div 
                className="dropdown-inactive" 
                onClick={handleClick}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    border: '2px solid #4caf50',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                }}
            >
                <div style={{ flex: 1, marginRight: '10px' }}>
                    {product.categoryId === 0 ? "Select Category" : categoryName.current}
                </div>
                <div style={{ padding: '4px' }}>
                    {isActive ? <FaChevronUp /> : <FaChevronDown />}
                </div>
            </div>
            {isActive && (
                <div 
                    className="dropdown-content" 
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        width: '100%',
                        maxWidth: '390px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        backgroundColor: '#fff',
                        border: '2px solid #4caf50',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        marginTop: '5px',
                    }}
                >
                    {categories.map((category) => (
                        <div 
                            key={category.id} 
                            onClick={() => {
                                categoryName.current = category.categoryName;
                                handleClick();
                                setProduct({ ...product, categoryId: category.id });
                            }} 
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                borderBottom: '1px solid #f0f0f0',
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
                        >
                            {category.categoryName}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}