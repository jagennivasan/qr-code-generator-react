import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/users";
      const { data: res } = await axios.post(url, data);
      navigate("/login");
      console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Signup Form</h1>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            name="firstName"
            onChange={handleChange}
            value={data.firstName}
            type="text"
            className="form-control"
            id="firstName"
            placeholder="First Name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            name="lastName"
            type="text"
            value={data.lastName}
            onChange={handleChange}
            className="form-control"
            id="lastName"
            placeholder="Last Name"
          />
        </div>
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
          />
        </div>
        {error && <div className="text-danger">{error}</div>}
        <button type="submit" className="btn btn-success">
          Sign up
        </button>
      </form>
      <div>
        Already have an account?{" "}
        <span className="text-primary">
          <Link to="/login">Login</Link>
        </span>
      </div>
    </div>
  );
}
