import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import LogoOptions from "../common/LogoOptions";
import { IoMdSettings } from "react-icons/io";
import { FaImages } from "react-icons/fa";
import Accordion from "react-bootstrap/Accordion";
import currencies from "../common/currencies";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PayPalQRCode = () => {
  const [paymentType, setPaymentType] = useState("sale");
  const [email, setEmail] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemId, setItemId] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [shipping, setShipping] = useState("");
  const [taxRate, setTaxRate] = useState("");

  const [logo, setLogo] = useState(null);
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

    qrCode.current.append(ref.current);
  }, [logo]);

  const validateFields = () => {
    if (!email || !itemName || !itemId || !price) {
      setErrorMessage("Please fill all required fields.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const updateQRCode = () => {
    if (!validateFields()) return;

    const url = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(
      email
    )}&item_name=${encodeURIComponent(
      itemName
    )}&item_number=${encodeURIComponent(
      itemId
    )}&amount=${price}&currency_code=${currency}&shipping=${shipping}&tax_rate=${taxRate}&paymentaction=${paymentType}`;

    qrCode.current.update({
      data: url,
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
    qrCode.current.getRawData("png").then((blob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.replace(
          /^data:image\/png;base64,/,
          ""
        );
        setQrImage(base64String); // Set base64 string
      };
      reader.readAsDataURL(blob);
    });
  };

  useEffect(updateQRCode, [
    paymentType,
    email,
    itemName,
    itemId,
    price,
    currency,
    shipping,
    taxRate,
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

  const onDownloadClick = (extension) => {
    qrCode.current.download({
      extension: extension,
    });
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
  const handleSaveQRCode = async () => {
    const formData = new FormData();
    formData.append("type", "paypal");
    formData.append("paymentType", paymentType);
    formData.append("email", email);
    formData.append("itemName", itemName);
    formData.append("itemId", itemId);
    formData.append("price", price);
    formData.append("currency", currency);
    formData.append("shipping", shipping);
    formData.append("taxRate", taxRate);
    formData.append("dotsColor", dotsColor);
    formData.append("backgroundColor", backgroundColor);
    formData.append("markerBorderColor", markerBorderColor);
    formData.append("markerCenterColor", markerCenterColor);
    formData.append("dotsType", dotsType);
    formData.append("cornersType", cornersType);
    formData.append("cornersDotType", cornersDotType);

    if (qrImage) {
      formData.append("qrImageBase64", qrImage); // Append base64 string directly
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/qrCodes/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": token,
        },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving QR code:", error);
      alert("Failed to save QR Code.");
    }
  };
  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-lg-6">
          <div className="my-3">
            <h5>PayPal QR Code</h5>
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            <div className="form-group my-2">
              <label>Payment Type</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="form-control"
              >
                <option value="buy now">Buy now</option>
                <option value="Add to card">Add to card</option>
                <option value="donation">Donation</option>
              </select>
            </div>
            <div className="form-group my-2">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter PayPal email"
              />
            </div>
            <div className="form-group my-2">
              <label>Item Name</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="form-control"
                placeholder="Enter item name"
              />
            </div>
            <div className="form-group my-2">
              <label>Item ID</label>
              <input
                type="text"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="form-control"
                placeholder="Enter item ID"
              />
            </div>
            <div className="form-group my-2">
              <label>Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="form-control"
                placeholder="Enter price"
              />
            </div>
            <div className="form-group my-2">
              <label>Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="form-control"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group my-2">
              <label>Shipping</label>
              <input
                type="number"
                value={shipping}
                onChange={(e) => setShipping(e.target.value)}
                className="form-control"
                placeholder="Enter shipping cost"
              />
            </div>
            <div className="form-group my-2">
              <label>Tax Rate</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="form-control"
                placeholder="Enter tax rate"
              />
            </div>
          </div>
          <div>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  {" "}
                  <IoMdSettings className="mx-2" /> Option
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
              <Accordion.Item
                eventKey="1"
                className="mt-5"
                style={{ maxWidth: "900px" }}
              >
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

export default PayPalQRCode;
