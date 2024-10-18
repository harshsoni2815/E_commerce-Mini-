import React, { useEffect, useState } from 'react';
import './order_list.css';
import Nav from '../nav';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from the backend
    const fetchOrders = async () => {
      try {
        // Get JWT token from local storage
        const token = localStorage.getItem("token");

        // Fetch orders with the authorization header if the token exists
        const response = await fetch('http://localhost:3000/api/order', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include JWT token in headers
          },
        });

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
          throw new Error("Failed to fetch orders: " + response.statusText);
        }

        const data = await response.json();
        setOrders(data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle order cancellation
  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`http://localhost:3000/api/order/${orderId}`, {
        method: 'PATCH', // Use PATCH for updating the order status
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Update the status of the canceled order in the state
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: 'Canceled' } : order
        ));
        alert("Order canceled successfully!");
      } else {
        alert("Failed to cancel order.");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  if (!orders.length) {
    return <p>No orders found.</p>;
  }

  return (
    <>
      <Nav />
      <div className="order-list-container">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <img src={order.product_image} alt={order.product_name} className="order-image" />
            <div className="order-details">
              <h3>{order.product_name}</h3>
              <p>Price: ${order.product_price}</p>
              <p>Address: {order.address}</p>
              <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
              <p>Status: {order.status}</p>
              {order.status === 'Pending' && (
              <button className="cancel-btn">Cancel Order</button>

              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OrderList;
