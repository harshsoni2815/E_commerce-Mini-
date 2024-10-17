// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import './App.css';
import Home from './components/Home';
import ProductDetails from './components/productDetails';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/home" element={<Home/>} />
                <Route exact path="/product/:id" element={<ProductDetails/>} />
               
            </Routes>
        </Router>
    );
};

export default App;
