import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import "./card.css";
import Nav from "./nav";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]); 
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/home/${id}`);
        const data = await response.json();
        setProduct(data.data[0]); 
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
        setComments(data.data); 
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
      setComments([...comments, addedComment]); 
      setCommentText("");
      setRating(1); 
    } else {
      alert("Failed to add comment");
    }
  };

 const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, 
        },
        body: JSON.stringify({ productId: id }), 
      });

      if (response.ok) {
        const result = await response.json(); 
        alert("Product added to cart!"); 
      } else {
        alert("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };


  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/"); 
      return;
    }
    navigate(`/checkout/${id}`); 
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

       
        
      </div>
    </>
  );
};

export default ProductDetails;
