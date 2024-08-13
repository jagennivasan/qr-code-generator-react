import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import LogoOptions from "../common/LogoOptions";
import { IoMdSettings } from "react-icons/io";
import { FaImages } from "react-icons/fa";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AppQRCode = () => {
  const [appName, setAppName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [androidApp, setAndroidApp] = useState("");
  const [iosApp, setIosApp] = useState("");

  const [logo, setLogo] = useState(null);
  const [dotsColor, setDotsColor] = useState("#4267b2");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [markerBorderColor, setMarkerBorderColor] = useState("#000000");
  const [markerCenterColor, setMarkerCenterColor] = useState("#4267b2");
  const [dotsType, setDotsType] = useState("rounded");
  const [cornersType, setCornersType] = useState("square");
  const [cornersDotType, setCornersDotType] = useState("dot");

  const [qrData, setQrData] = useState("");
  const [error, setError] = useState("");
  const [qrImage, setQrImage] = useState(null);
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

  useEffect(() => {
    if (appName && description && website && androidApp && iosApp) {
      const formattedData = `appName: ${appName}, description: ${description}, website: ${website}, androidApp: ${androidApp}, iosApp: ${iosApp}`;
      setError("");
      setQrData(formattedData);
    } else {
      setError("Please fill all fields.");
      setQrData("");
    }
  }, [appName, description, website, androidApp, iosApp]);

  useEffect(() => {
    if (qrCode.current && qrData) {
      qrCode.current.update({
        data: qrData,
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
          setQrImage(base64String);
        };
        reader.readAsDataURL(blob);
      });
    }
  }, [
    qrData,
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
    qrCode.current.download({ extension });
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
    formData.append("type", "app");
    formData.append("appName", appName);
    formData.append("description", description);
    formData.append("website", website);
    formData.append("androidApp", androidApp);
    formData.append("iosApp", iosApp);
    formData.append("dotsColor", dotsColor);
    formData.append("backgroundColor", backgroundColor);
    formData.append("markerBorderColor", markerBorderColor);
    formData.append("markerCenterColor", markerCenterColor);
    formData.append("dotsType", dotsType);
    formData.append("cornersType", cornersType);
    formData.append("cornersDotType", cornersDotType);

    if (qrImage) {
      formData.append("qrImageBase64", qrImage);
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
      <form>
        <div className="row">
          <div className="col-lg-6">
            <div className="my-3">
              <h3>Submit App Details</h3>
              <label className="form-label">Submit App Name</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="eg. Facebook"
                className="form-control my-2"
              />
              <label className="form-label">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="form-control my-2"
              />
              <label className="form-label">Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="eg. https://facebook.com"
                className="form-control my-2"
              />
              <h2>App Links</h2>
              <label htmlFor="" className="form-label">
                Android App
              </label>
              <input
                type="text"
                value={androidApp}
                onChange={(e) => setAndroidApp(e.target.value)}
                className="form-control my-2"
                placeholder="https://playstore.com/store/apps"
              />
              <label className="form-label">iOS App</label>
              <input
                type="text"
                value={iosApp}
                onChange={(e) => setIosApp(e.target.value)}
                placeholder="https://apps.apple.com/us/app/"
                className="form-control my-2"
              />
              {error && <div className="text-danger mt-2">{error}</div>}
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
                        title="Dots Color"
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
                        title="Marker Border Color"
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
                        title="Marker Center Color"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="mx-2">Dots Type</label>
                      <select
                        className="form-select"
                        value={dotsType}
                        onChange={(e) => setDotsType(e.target.value)}
                      >
                        <option value="rounded">Rounded</option>
                        <option value="classy">Classy</option>
                        <option value="classy-rounded">Classy Rounded</option>
                        <option value="square">Square</option>
                        <option value="dots">Dots</option>
                        <option value="extra-rounded">Extra Rounded</option>
                      </select>
                    </div>
                    <div className="mt-2">
                      <label className="mx-2">Corners Type</label>
                      <select
                        className="form-select"
                        value={cornersType}
                        onChange={(e) => setCornersType(e.target.value)}
                      >
                        <option value="square">Square</option>
                        <option value="extra-rounded">Extra Rounded</option>
                        <option value="dot">Dot</option>
                        <option value="classy">Classy</option>
                        <option value="classy-rounded">Classy Rounded</option>
                      </select>
                    </div>
                    <div className="mt-2">
                      <label className="mx-2">Corners Dot Type</label>
                      <select
                        className="form-select"
                        value={cornersDotType}
                        onChange={(e) => setCornersDotType(e.target.value)}
                      >
                        <option value="dot">Dot</option>
                        <option value="square">Square</option>
                      </select>
                    </div>
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
                    <div className="form-group mb-3">
                      <label htmlFor="formFile" className="form-label">
                        Choose Logo
                      </label>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="form-control"
                        id="formFile"
                        accept="image/*"
                      />
                    </div>
                    <LogoOptions onLogoSelect={handleLogoSelect} />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
          <div className="col-lg-6 text-center bg-light p-4">
            <div ref={ref}></div>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => onDownloadClick("png")}
                className="btn btn-primary mx-2"
              >
                Download PNG
              </button>
              <button
                type="button"
                onClick={() => onDownloadClick("svg")}
                className="btn btn-secondary mx-2"
              >
                Download SVG
              </button>
              <button
                type="button"
                onClick={handleSaveQRCode}
                className="btn btn-success mx-2"
              >
                Save QR Code
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AppQRCode;

const style = {
  inputColor: {
    width: "4rem",
    height: "3rem",
    padding: "0.1rem",
    margin: "0.1rem",
  },
};
