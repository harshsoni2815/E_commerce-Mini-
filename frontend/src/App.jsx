// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import './App.css';
import Home from './components/Home';
import ProductDetails from './components/productDetails';
import OrderPage from './components/order/order';
import OrderList from './components/order_list/order_list';
import Cart from './components/cartcom/cart';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/home" element={<Home/>} />
                <Route exact path="/product/:id" element={<ProductDetails/>} />
                <Route exact path="/checkout/:id"  element={<OrderPage/>}/>
                <Route exact path='/order' element={<OrderList/>}/>
                <Route path="/cart" element={<Cart />} /> 
               
            </Routes>
        </Router>
    );
};

export default App;
