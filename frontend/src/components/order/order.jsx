import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./order.css"; // Import your CSS for styling
import Nav from "../nav"; // Import your navigation component

const OrderPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // For navigation

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false); // For order success alert
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication status

  useEffect(() => {
    console.log("Product ID from URL:", id);
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/home/${id}`);
        const data = await response.json();
        setProduct(data.data[0]); // Assuming 'data' contains product details
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, navigate]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    
    if (!address) {
      alert("Please enter a valid address.");
      return;
    }

    const orderData = {
      userId: 1, // Replace with real user ID
      productId: id,
      address,
    };

    try {
      const response = await fetch("http://localhost:3000/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include JWT token in the headers
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setOrderSuccess(true);
        setTimeout(() => {
          navigate(`/home`); // Redirect to orders page after successful order
          alert("order succecfully placed");
        }, 2000);
      } else {
        alert("Order submission failed.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <>
      <Nav />
      <div className="order-page">
        <h2>Complete Your Order</h2>

        <div className="order-detail-card">
          <div className="product-info">
            <img src={product.image_link} alt={product.name} className="small-image" />
            <div>
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
            </div>
          </div>
          <p>{product.description}</p>
        </div>

        <div className="order-form">
          <h3>Shipping Information</h3>
          <form onSubmit={handleOrderSubmit}>
            <label htmlFor="address">Shipping Address:</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              required
            />

            <button type="submit">Place Order</button>
          </form>
        </div>

        {orderSuccess && <div className="alert-success">Order placed successfully!</div>}
      </div>
    </>
  );
};

export default OrderPage;
