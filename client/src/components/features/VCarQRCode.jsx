import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import LogoOptions from "../common/LogoOptions";
import { IoMdSettings } from "react-icons/io";
import { FaImages } from "react-icons/fa";
import Accordion from "react-bootstrap/Accordion";
import axios from 'axios';
import {useNavigate} from "react-router-dom"
const VCardQRCode = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [fax, setFax] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");
  const [logo, setLogo] = useState(null);
  const [dotsColor, setDotsColor] = useState("#4267b2");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [markerBorderColor, setMarkerBorderColor] = useState("#000000");
  const [markerCenterColor, setMarkerCenterColor] = useState("#4267b2");
  const [dotsType, setDotsType] = useState("rounded");
  const [cornersType, setCornersType] = useState("square");
  const [cornersDotType, setCornersDotType] = useState("dot");
  const [error, setError] = useState("");
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

  const validateInputs = () => {
    if (!firstName || !lastName || !phone || !mobile || !email || !website || !jobTitle || !fax || !address || !city || !postcode || !country) {
      setError("Please fill in all the fields.");
      return false;
    }
    setError(""); 
    return true;
  };

const updateQRCode = ()=>{
  if(!validateInputs()) return;
const qrData = `firstName:${firstName},lastName:${lastName},phone:${phone},mobile:${mobile},email:${email},website:${website},company:${company},jobTitle:${jobTitle},fax:${fax},address:${address},address:${address},postcode:${postcode},country:${country},`
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
    setQrImage(base64String); // Set base64 string
  };
  reader.readAsDataURL(blob);
});


}


  useEffect(updateQRCode, [
    firstName,
    lastName,
    phone,
    mobile,
    email,
    website,
    company,
    jobTitle,
    fax,
    address,
    city,
    postcode,
    country,
    logo,
    dotsColor,
    backgroundColor,
    markerBorderColor,
    markerCenterColor,
    dotsType,
    cornersType,
    cornersDotType,
  ]);

  const validateFields = () => {
    if (!firstName || !lastName || !phone || !email) {
      setError("Please fill in all required fields: First Name, Last Name, Phone, Email.");
      return false;
    }
    return true;
  };

  const handleColorChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const onDownloadClick = (extension) => {
    if (validateFields()) {
      qrCode.current.download({
        extension: extension,
      });
    }
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
    formData.append("type", "vcard");
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phone", phone);
    formData.append("mobile",mobile)
    formData.append("email",email)
    formData.append("website",website)
    formData.append("company",company)
    formData.append("jobTitle",jobTitle)
    formData.append("fax",fax)
    formData.append("address",address)
    formData.append("city",city)
    formData.append("postcode",postcode)
    formData.append("country",country)
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
      navigate("/dashboard")
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
            <h3>Contact Information</h3>
            {/* Input fields */}
            <label className="form-label">First name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="form-control my-2"
              placeholder="First Name"
            />
            <label className="form-label">Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="form-control my-2"
              placeholder="Last Name"
            />
            <label className="form-label">Phone number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control my-2"
              placeholder="Phone"
            />
            <label className="form-label">Mobile</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="form-control my-2"
              placeholder="Mobile"
            />
            <label className="form-label">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control my-2"
              placeholder="Email"
            />
            <label className="form-label">Website (URL)</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="form-control my-2"
              placeholder="Website"
            />
            <label className="form-label">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="form-control my-2"
              placeholder="Company"
            />
            <label className="form-label">Job title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="form-control my-2"
              placeholder="Job Title"
            />
            <label className="form-label">Fax</label>
            <input
              type="text"
              value={fax}
              onChange={(e) => setFax(e.target.value)}
              className="form-control my-2"
              placeholder="Fax"
            />
            <label className="form-label">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control my-2"
              placeholder="Address"
            />
            <label className="form-label">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-control my-2"
              placeholder="City"
            />
            <label className="form-label">Post code</label>
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="form-control my-2"
              placeholder="Postcode"
            />
            <label className="form-label">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="form-control my-2"
              placeholder="Country"
            />
            {/* Error message */}
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
                  {/* Color pickers */}
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
                  {/* Shape and form selectors */}
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
            <button onClick={handleSaveQRCode} className="btn btn-success ms-2">
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

export default VCardQRCode;
