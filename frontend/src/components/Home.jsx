

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../components/Home.css'; 
import Nav from './nav';
import '../../css.css'

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
       
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
        <div className='container'>
            <Nav></Nav>
            <h2>Product List</h2>
            <div className="product-list">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <img src={product.image_link} alt={product.name} />
                        <h3>{product.name}</h3>
                        <h4>left:{product.quantity}</h4>
                        <p>Price: ${product.price}</p>
                       
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
