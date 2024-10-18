import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./card.css";
import Nav from "./nav";

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // For navigation

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]); // State for comments
  const [commentText, setCommentText] = useState(""); // State for new comment
  const [rating, setRating] = useState(1); // State for rating
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication status

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get JWT token from local storage
    if (token) {
      setIsAuthenticated(true);
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

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/comments/${id}`);
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
      postId: id,
      commentText: commentText,
      created_at: new Date().toISOString(),
      rating: rating,
    };

    const response = await fetch("http://localhost:3000/api/comments/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include JWT token
      },
      body: JSON.stringify(newComment),
    });

    if (response.ok) {
      const addedComment = await response.json();
      setComments([...comments, addedComment]); // Update comments
      setCommentText(""); // Clear input
      setRating(1); // Reset rating
    } else {
      alert("Failed to add comment");
    }
  };

 const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Only send the token
        },
        body: JSON.stringify({ productId: id }), // Only send the product ID
      });

      if (response.ok) {
        const result = await response.json(); // Get the response from the server
        alert("Product added to cart!"); // Notify user
      } else {
        alert("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };


  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/"); // Redirect to login if not authenticated
      return;
    }
    navigate(`/checkout/${id}`); // Navigate to checkout page
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
      <div>
        <h2>Product Details</h2>
        <div className="product-detail">
          <img src={product.image_link} alt={product.name} className="image" />
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
          <p>{product.description}</p>
        </div>
        <div className="btn-container" >
          <button onClick={handleAddToCart} className="btn">Add to Cart</button>
          <button onClick={handleBuyNow} className="btn">Buy Now</button>
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

          {isAuthenticated ? (
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
          ) : (
            <p>Please log in to add a comment.</p>
          )}
        </div>

        {/* Add buttons for Buy Now and Add to Cart */}
        
      </div>
    </>
  );
};

export default ProductDetails;
