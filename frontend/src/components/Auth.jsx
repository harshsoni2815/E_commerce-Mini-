import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Nav from "./nav";
import '../../css.css'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if token exists and is valid
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally, you can decode the token to check for expiration here
      navigate("/home"); // Redirect to home if logged in
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    setError(""); // Reset any previous error message

    const { username, ...data } = formData; // Extract username for signup
    const url = isLogin
      ? "http://localhost:3000/api/auth/login"
      : "http://localhost:3000/api/auth/signup";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isLogin ? { email: formData.email, password: formData.password } : formData),

      });

      const responseData = await response.json();

      if (response.ok) {
        // Save JWT token in local storage
        if (isLogin) {
          localStorage.setItem("token", responseData.token);
          alert("Login successful!");
          navigate("/home");
        } else {
          alert("Signup successful!");
          setIsLogin(true);
          navigate("/home");
        }
      } else {
        setError(responseData.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false after the request is completed
    }
  };

  return (
    <>
      <Nav />
      <div className="login">
        <div>
          <h2>{isLogin ? "Login" : "Signup"}</h2>
          {error && <p className="error">{error}</p>} {/* Show error message */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Login" : "Signup"}
            </button>
          </form>
          <div className="logbtn">
            <button onClick={() => setIsLogin(!isLogin)}>
              Switch to {isLogin ? "Signup" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
