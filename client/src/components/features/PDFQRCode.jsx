import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { IoMdSettings } from "react-icons/io";
import Accordion from "react-bootstrap/Accordion";
import axios from 'axios';
import {  useNavigate } from "react-router-dom";

const PDFQRCode = () => {
  const [pdfUrl, setPdfUrl] = useState(""); 
  const [dotsColor, setDotsColor] = useState("#4267b2");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [markerBorderColor, setMarkerBorderColor] = useState("#000000");
  const [markerCenterColor, setMarkerCenterColor] = useState("#4267b2");
  const [dotsType, setDotsType] = useState("rounded");
  const [cornersType, setCornersType] = useState("square");
  const [cornersDotType, setCornersDotType] = useState("dot");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [qrImage, setQrImage] = useState(null); // State for QR code image
  const navigate = useNavigate();

  const ref = useRef(null);
  const qrCode = useRef(null);

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 300,
      height: 300,
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

    qrCode.current.append(ref.current);
  }, []);

  const validateFields = () => {
    if (!pdfUrl) {
      setErrorMessage("Please enter the PDF URL.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const updateQRCode = () => {
    if (!validateFields()) return;

    qrCode.current.update({
      data: pdfUrl,
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
  };

  useEffect(updateQRCode, [
    pdfUrl,
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

  const handleUrlChange = (e) => {
    setPdfUrl(e.target.value);
  };

  const onDownloadClick = (extension) => {
    if (!validateFields()) return;
    
    qrCode.current.download({
      extension: extension,
    });
  };
  const handleSaveQRCode = async () => {
    if (!pdfUrl ) {
      setError("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append('type', 'pdfurl');
    formData.append('pdfUrl', pdfUrl);
    
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
      navigate("/dashboard");
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
            <h3>Enter Google Drive PDF URL</h3>
            <input
              type="text"
              value={pdfUrl}
              onChange={handleUrlChange}
              className="form-control my-2"
              placeholder="Enter Google Drive PDF URL"
            />
            <small className="form-text text-muted my-2">
              Enter the URL of a PDF file from Google Drive to generate the QR code.
            </small>
          </div>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <div>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <IoMdSettings className="mx-2" /> Options
                </Accordion.Header>
                <Accordion.Body>
                  <h2>Color</h2>
                  <p className="mt-2">Background color</p>
                  <div className="form-group-inline d-flex">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={handleColorChange(setBackgroundColor)}
                      className="form-control custom-color-input"
                      id="colorInput"
                      style={style.inputColor}
                      title="Background Color"
                    />
                  </div>
                  <p className="mt-2">Dots color</p>
                  <div className="form-group-inline d-flex">
                    <input
                      type="color"
                      value={dotsColor}
                      onChange={handleColorChange(setDotsColor)}
                      className="form-control custom-color-input"
                      id="colorInput"
                      style={style.inputColor}
                    />
                  </div>
                  <p className="mt-2">Marker border color</p>
                  <div className="form-group-inline d-flex">
                    <input
                      type="color"
                      value={markerBorderColor}
                      onChange={handleColorChange(setMarkerBorderColor)}
                      className="form-control custom-color-input"
                      id="colorInput"
                      style={style.inputColor}
                    />
                  </div>
                  <p className="mt-2">Marker center color</p>
                  <div className="form-group-inline d-flex">
                    <input
                      type="color"
                      value={markerCenterColor}
                      onChange={handleColorChange(setMarkerCenterColor)}
                      className="form-control custom-color-input"
                      id="colorInput"
                      style={style.inputColor}
                    />
                  </div>
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
            </Accordion>
          </div>
        </div>
        <div className="col-lg-6 text-center bg-light p-4">
          <div ref={ref} />
          <div className="mt-3">
            <button
              onClick={() => onDownloadClick("png")}
              className="btn btn-primary me-2"
            >
              Download PNG
            </button>
            <button
              onClick={() => onDownloadClick("svg")}
              className="btn btn-secondary"
            >
              Download SVG
            </button>
            <button onClick={handleSaveQRCode} className="btn btn-success mx-2">
              Save QR Code
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

const style = {
  inputColor: {
    width: "100px",
    height: "50px",
    padding: "5px",
  },
};

export default PDFQRCode;
