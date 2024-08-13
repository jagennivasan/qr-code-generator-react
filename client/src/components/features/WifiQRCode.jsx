import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import LogoOptions from "../common/LogoOptions";
import { IoMdSettings } from "react-icons/io";
import { FaImages } from "react-icons/fa";
import Accordion from "react-bootstrap/Accordion";
import axios from 'axios';
import {useNavigate} from "react-router-dom"

const WifiQRCode = () => {
  const [networkName, setNetworkName] = useState("");
  const [networkType, setNetworkType] = useState("WPA/WPA2");
  const [passwordData, setPasswordData] = useState("");
  const [logo, setLogo] = useState(null);
  const [dotsColor, setDotsColor] = useState("#4267b2");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [markerBorderColor, setMarkerBorderColor] = useState("#000000");
  const [markerCenterColor, setMarkerCenterColor] = useState("#4267b2");
  const [dotsType, setDotsType] = useState("rounded");
  const [cornersType, setCornersType] = useState("square");
  const [cornersDotType, setCornersDotType] = useState("dot");
  const [error, setError] = useState(""); // State to hold the error message
  const [qrImage, setQrImage] = useState(null); // State for QR code image
  const navigate = useNavigate();
  const ref = useRef(null);
  const qrCode = useRef(null);

  useEffect(() => {
    // Initialize QR code styling only once
    qrCode.current = new QRCodeStyling({
      width: 300,
      height: 300,
      image: logo ? logo : "",
      dotsOptions: {
        color: dotsColor,
        type: dotsType,
      },
      backgroundOptions: {
        color: backgroundColor,
      },
      cornersSquareOptions: {
        color: markerBorderColor,
        type: cornersType,
      },
      cornersDotOptions: {
        color: markerCenterColor,
        type: cornersDotType,
      },
      imageOptions: {
        crossOrigin: "anonymous",
      },
    });

    // Append the QR code to the ref element
    if (ref.current) {
      qrCode.current.append(ref.current);
    }
  }, [logo, dotsColor, backgroundColor, markerBorderColor, markerCenterColor, dotsType, cornersType, cornersDotType]);

  useEffect(() => {
    if (!networkName || !passwordData) {
      setError("Please fill all required fields.");
      return;
    } else {
      setError(""); // Clear error message when fields are filled
    }

    // Ensure qrCode.current is initialized
    if (qrCode.current) {
      qrCode.current.update({
        data: `WIFI:S:${networkName};T:${networkType};P:${passwordData};;`,
        image: logo ? logo : "",
        dotsOptions: {
          color: dotsColor,
          type: dotsType,
        },
        backgroundOptions: {
          color: backgroundColor,
        },
        cornersSquareOptions: {
          color: markerBorderColor,
          type: cornersType,
        },
        cornersDotOptions: {
          color: markerCenterColor,
          type: cornersDotType,
        },
      });
      qrCode.current.getRawData('png').then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.replace(/^data:image\/png;base64,/, '');
          setQrImage(base64String); // Set base64 string
        };
        reader.readAsDataURL(blob);
      });
    }
  }, [
    networkName,
    networkType,
    passwordData,
    logo,
    dotsColor,
    backgroundColor,
    markerBorderColor,
    markerCenterColor,
    dotsType,
    cornersType,
    cornersDotType,
  ]);

  const handleColorChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleLogoSelect = (selectedLogo) => {
    setLogo(selectedLogo === null ? null : selectedLogo);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQRCode = (format) => {
    if (qrCode.current) {
      qrCode.current.download({ extension: format });
    }
  };

  

  const handleSaveQRCode = async () => {
    if (!networkName || !networkType || !passwordData) {
      setError("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append('type', 'wifi');
    formData.append('networkName', networkName);
    formData.append('networkType', networkType);
    formData.append('passwordData', passwordData);
    formData.append('dotsColor', dotsColor);
    formData.append('backgroundColor', backgroundColor);
    formData.append('markerBorderColor', markerBorderColor);
    formData.append('markerCenterColor', markerCenterColor);
    formData.append('dotsType', dotsType);
    formData.append('cornersType', cornersType);
    formData.append('cornersDotType', cornersDotType);

    if (qrImage) {
      formData.append('qrImageBase64', qrImage); // Append base64 string directly
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post('http://localhost:8080/api/qrCodes/save', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });
      navigate("/dashboard")
    } catch (error) {
      console.error('Error saving QR code:', error);
      alert('Failed to save QR Code.');
    }
  };
  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-lg-6">
          <div className="my-3">
            <h4>WI-FI</h4>
            <input
              type="text"
              value={networkName}
              onChange={(e) => setNetworkName(e.target.value)}
              className="form-control my-2"
              placeholder="Network Name"
            />
            <label className="form-label">Network Type</label>
            <select
              onChange={(e) => setNetworkType(e.target.value)}
              value={networkType}
              className="form-control my-2"
            >
              <option value="WEP">WEP</option>
              <option value="WPA/WPA2">WPA/WPA2</option>
              <option value="NONE">None</option>
            </select>
            <label className="form-label">Password</label>
            <div className="input-group my-2">
              <input
                type="text"
                value={passwordData}
                onChange={(e) => setPasswordData(e.target.value)}
                className="form-control"
                placeholder="Password"
              />
            </div>
            {error && <div className="alert alert-danger mt-2">{error}</div>} {/* Display error message */}
          </div>
          <div>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <IoMdSettings className="mx-2" /> Options
                </Accordion.Header>
                <Accordion.Body>
                  <h2>Color</h2>
                  <p className="mt-2">Background color</p>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={handleColorChange(setBackgroundColor)}
                    className="form-control custom-color-input"
                    style={{ width: "100px", height: "50px", padding: "5px" }}
                  />
                  <p className="mt-2">Dots color</p>
                  <input
                    type="color"
                    value={dotsColor}
                    onChange={handleColorChange(setDotsColor)}
                    className="form-control custom-color-input"
                    style={{ width: "100px", height: "50px", padding: "5px" }}
                  />
                  <p className="mt-2">Marker border color</p>
                  <input
                    type="color"
                    value={markerBorderColor}
                    onChange={handleColorChange(setMarkerBorderColor)}
                    className="form-control custom-color-input"
                    style={{ width: "100px", height: "50px", padding: "5px" }}
                  />
                  <p className="mt-2">Marker center color</p>
                  <input
                    type="color"
                    value={markerCenterColor}
                    onChange={handleColorChange(setMarkerCenterColor)}
                    className="form-control custom-color-input"
                    style={{ width: "100px", height: "50px", padding: "5px" }}
                  />
                  <h2>Shape & Form</h2>
                  <label className="form-label">Dots</label>
                  <select
                    onChange={(e) => setDotsType(e.target.value)}
                    value={dotsType}
                    className="form-control"
                  >
                    <option value="rounded">Rounded</option>
                    <option value="dots">Dots</option>
                    <option value="classy">Classy</option>
                    <option value="classy-rounded">Classy Rounded</option>
                    <option value="extra-rounded">Extra Rounded</option>
                    <option value="square">Square</option>
                  </select>
                  <label className="form-label">Marker border</label>
                  <select
                    onChange={(e) => setCornersType(e.target.value)}
                    value={cornersType}
                    className="form-control"
                  >
                    <option value="square">Square</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                  <label className="form-label">Marker center</label>
                  <select
                    onChange={(e) => setCornersDotType(e.target.value)}
                    value={cornersDotType}
                    className="form-control"
                  >
                    <option value="dot">Dot</option>
                    <option value="square">Square</option>
                  </select>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1" className="mt-5" style={{ maxWidth: "900px" }}>
                <Accordion.Header>
                  <FaImages className="mx-2" /> Logo
                </Accordion.Header>
                <Accordion.Body>
                  <LogoOptions
                    logo={logo}
                    onLogoSelect={handleLogoSelect}
                    onFileChange={handleFileChange}
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
        <div className="col-lg-6 text-center bg-light p-4">
          <div ref={ref} />
          <button
            className="btn btn-primary m-2"
            onClick={() => downloadQRCode("png")}
          >
            Download PNG
          </button>
          <button
            className="btn btn-secondary m-2"
            onClick={() => downloadQRCode("svg")}
          >
            Download SVG
          </button>
          <button onClick={handleSaveQRCode} className="btn btn-success">
              Save QR Code
            </button>
        </div>
           
          
      </div>
    </div>
  );
};

export default WifiQRCode;
