import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found. Redirecting to login.");
          navigate("/login");
          return;
        }

        const [userResponse, qrCodesResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/users/me", {
            headers: { "x-auth-token": token },
          }),
          axios.get("http://localhost:8080/api/qrCodes", {
            headers: { "x-auth-token": token },
          }),
        ]);

        setUser(userResponse.data);
        setQrCodes(qrCodesResponse.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/qrCodes/${id}`, {
        headers: { "x-auth-token": token },
      });
      setQrCodes(qrCodes.filter((qrCode) => qrCode._id !== id));
    } catch (error) {
      console.error("Failed to delete QR code:", error);
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  const imgStyle = {
    width: "100%",      
    maxWidth: "250px",  
    height: "auto",     
    margin: "0 auto",   
    display: "block",   
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center bg-success text-light p-4">
        <h3>
          Welcome, <span>{user ? user.firstName : "User"}</span>
        </h3>
        <div className="d-flex flex-column flex-md-row align-items-center mt-3 mt-md-0">
          {error && <p className="text-danger mx-md-3">{error}</p>}
          {user && <p className="mx-md-3">{user.email}</p>}
          <button onClick={handleLogout} className="btn btn-danger mt-2 mt-md-0">
            Log out
          </button>
        </div>
      </div>
      <div className="container mt-4">
        <Link to="/createQR" className="btn btn-success mb-4">
          Create QR Code
        </Link>
        <h2>Your QR Codes</h2>
        <div className="row">
          {qrCodes.length === 0 ? (
            <p>No QR codes found. Create one to see it here.</p>
          ) : (
            qrCodes.map((qrCode) => (
              <div className="col-12 col-sm-6 col-md-4 mb-3" key={qrCode._id}>
                <div className="card h-100">
                  <img
                    src={`http://localhost:8080/${qrCode.qrImage}`}
                    style={imgStyle}
                    alt={qrCode.type}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{qrCode.type.toUpperCase()}</h5>
                    <p className="card-text">
                      Updated {moment(qrCode.createdAt).format("DD MMMM hh:mm A, YYYY")}
                    </p>
                    <div className="mt-auto">
                      <button
                        onClick={() => handleDelete(qrCode._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
