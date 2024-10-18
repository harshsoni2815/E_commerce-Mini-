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
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 

  const navigate = useNavigate();

  useEffect(() => {
  
    const token = localStorage.getItem("token");
    if (token) {
      
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError(""); 

    const { username, ...data } = formData; 
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
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="login">
        <div>
          <h2>{isLogin ? "Login" : "Signup"}</h2>
          {error && <p className="error">{error}</p>}
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
