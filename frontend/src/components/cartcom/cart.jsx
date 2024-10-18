import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Nav from "../nav";
import "./cart.css"; // You can create this CSS file to style your cart

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("token"); // Get JWT token from local storage
      if (!token) {
        navigate("/login"); // Redirect to login if not authenticated
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();
        setCartItems(data.data); // Set cart items to state
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [navigate]);

  const handleRemoveFromCart = async (itemId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/api/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item.id !== itemId)); // Update the cart items
        alert("Item removed from cart!");
      } else {
        alert("Failed to remove item from cart.");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <>
      <Nav />
      <div className="cart-container">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>No items in the cart.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image_link} alt={item.name} className="cart-image" />
                <div className="cart-details">
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price}</p>
                  <button onClick={() => handleRemoveFromCart(item.id)} className="remove-btn btn">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Cart;
