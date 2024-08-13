import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = "http://localhost:8080/api/auth/login"; // Ensure this URL is correct
      const { data: res } = await axios.post(url, data);

      localStorage.setItem("token", res.data); // Assuming res.data is the token
navigate("/dashboard")
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(
          error.response.data.message || "An error occurred. Please try again."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
        <h1 className="mb-4">Login Form</h1>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            className="form-control"
            id="email"
            placeholder="Enter your email address"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={data.password}
            onChange={handleChange}
            className="form-control"
            id="password"
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <div className="text-danger mb-3">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-3">
        Don't have an account?{" "}
        <span className="text-primary">
          <Link to="/signup">Signup</Link>
        </span>
      </div>
    </div>
  );
}
