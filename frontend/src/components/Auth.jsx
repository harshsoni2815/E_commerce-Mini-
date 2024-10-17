import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./login.css";
import { Link } from "react-router-dom";
import Nav from "./nav";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, ...data } = formData; // Extract username for signup
    const url = isLogin
      ? "http://localhost:3000/api/auth/login"
      : "http://localhost:3000/api/auth/signup"; // Use proxy

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isLogin ? { email: data.email, password: data.password } : data
        ),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Save JWT token in local storage (or handle it as needed)
        if (isLogin) {
          localStorage.setItem("token", responseData.token);
          alert("Login successful!");
          navigate("/home"); // Navigate to home page
        } else {
          alert("Signup successful!");
          setIsLogin(true); // Switch to login view after signup
        }
      } else {
        alert(responseData.message); // Show error message
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <Nav> </Nav>
      <div className="login">
        <div>
          <h2>{isLogin ? "Login" : "Signup"}</h2>
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
            <button type="submit">{isLogin ? "Login" : "Signup"}</button>
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
