// src/components/Home.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../components/Home.css'; // Optional: For custom styles
import Nav from './nav';


const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch products from your API
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/home');
                const data = await response.json();
                setProducts(data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <Nav></Nav>
            <h2>Product List</h2>
            <div className="product-list">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <img src={product.image_link} alt={product.name} />
                        <h3>{product.name}</h3>
                        <h4>left:{product.quantity}</h4>
                        <p>Price: ${product.price}</p>
                        {/* Button to view more details about the product */}
                        <Link to={`/product/${product.id}`}>
                            <button>View Details</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
