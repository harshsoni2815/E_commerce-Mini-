// src/components/ProductDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./card.css";
import Nav from "./nav";

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]); // State for comments
  const [commentText, setCommentText] = useState(""); // State for new comment
  const [rating, setRating] = useState(1); // State for rating

  useEffect(() => {
    // Fetch product details from your API
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

    // Fetch comments for the product
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/comments/${id}`
        );
        const data = await response.json();
       
        setComments(data.data); // Assuming data contains the comments
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchProductDetails();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const newComment = {
      product_id: id,
      comment_text: commentText,
      created_at: new Date().toISOString(),
      rating: rating,
    };

    // Send comment to the backend
    const response = await fetch("http://localhost:3000/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    });

    if (response.ok) {
      const addedComment = await response.json(); // Get the added comment
      setComments([...comments, addedComment]); // Update comments list
      setCommentText(""); // Clear the input field
      setRating(1); // Reset rating
    } else {
      alert("Failed to add comment");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (<>
    <Nav> </Nav>
    <div>
      <h2>Product Details</h2>
      <div className="product-detail">
        <img src={product.image_link} alt={product.name} className="image" />
        <h3>{product.name}</h3>
        <p>Price: ${product.price}</p>
        <p>{product.description}</p>
      </div>

      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <div key={comment.id} className="comment-card">
          <strong>Rating: {comment.rating}</strong>
          <p>{comment.comment_text}</p>
          <p>{new Date(comment.created_at).toLocaleDateString()}</p>
        </div>
        ))}
      </ul>

      <div className="contain">
        <h3>Add a Comment</h3>

        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          />
          <div>
            <label>Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((rate) => (
                <option key={rate} value={rate}>
                  {rate}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Submit Comment</button>
        </form>
      </div>
    </div>
    </>
  );
};

export default ProductDetails;
