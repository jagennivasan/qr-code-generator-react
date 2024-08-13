import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import LogoOptions from "../common/LogoOptions";
import { IoMdSettings } from "react-icons/io";
import { FaImages } from "react-icons/fa";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EventQRCode = () => {
  const [eventTitle, setEventTitle] = useState("Sample Event");
  const [eventSummary, setEventSummary] = useState("Event summary...");
  const [eventStartDate, setEventStartDate] = useState("2024-01-01");
  const [eventEndDate, setEventEndDate] = useState("2024-01-02");
  const [eventTimezone, setEventTimezone] = useState("UTC");
  const [services, setServices] = useState({
    wifi: false,
    bathroom: false,
    handicapped: false,
    babiesAllowed: false,
    dogsAllowed: false,
    parking: false,
    food: false,
  });
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
    website: "",
  });
  const [logo, setLogo] = useState(null);
  const [dotsColor, setDotsColor] = useState("#4267b2");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [markerBorderColor, setMarkerBorderColor] = useState("#000000");
  const [markerCenterColor, setMarkerCenterColor] = useState("#4267b2");
  const [dotsType, setDotsType] = useState("rounded");
  const [cornersType, setCornersType] = useState("square");
  const [cornersDotType, setCornersDotType] = useState("dot");
  const [qrImage, setQrImage] = useState(null); // State for QR code image

  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const ref = useRef(null);
  const qrCode = useRef(null);

  useEffect(() => {
    if (ref.current) {
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
        data: "",
      });
      qrCode.current.append(ref.current);
    }
  }, [
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
    const newErrors = [];
    if (!eventTitle.trim()) newErrors.push("Event Title is required.");
    if (!eventSummary.trim()) newErrors.push("Event Summary is required.");
    if (!eventStartDate) newErrors.push("Start Date is required.");
    if (!eventEndDate) newErrors.push("End Date is required.");
    if (!eventTimezone.trim()) newErrors.push("Timezone is required.");
    if (!address.street.trim()) newErrors.push("Street Address is required.");
    if (!address.city.trim()) newErrors.push("City is required.");
    if (!address.state.trim()) newErrors.push("State is required.");
    if (!address.zip.trim()) newErrors.push("Zip Code is required.");
    if (!address.country.trim()) newErrors.push("Country is required.");
    if (!contact.name.trim()) newErrors.push("Contact Name is required.");
    if (!contact.phone.trim()) newErrors.push("Contact Phone is required.");
    if (!contact.email.trim()) newErrors.push("Contact Email is required.");
    if (!contact.website.trim()) newErrors.push("Contact Website is required.");
    return newErrors;
  };

  const updateQRCode = () => {
    const validationErrors = validateFields();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    const eventData = `
      Title: ${eventTitle}
      Summary: ${eventSummary}
      Start Date: ${eventStartDate}
      End Date: ${eventEndDate}
      Timezone: ${eventTimezone}
      Services: ${Object.entries(services)
        .filter(([_, checked]) => checked)
        .map(([service]) => service)
        .join(", ")}
      Address: ${address.street}, ${address.city}, ${address.state}, ${
      address.zip
    }, ${address.country}
      Contact: ${contact.name}, ${contact.phone}, ${contact.email}, ${
      contact.website
    }
    `.trim();

    try {
      if (qrCode.current) {
        qrCode.current.update({
          data: eventData,
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
      }
    } catch (error) {
      console.error("Error updating QR code:", error);
    }
  };

  useEffect(() => {
    updateQRCode();
  }, [
    eventTitle,
    eventSummary,
    eventStartDate,
    eventEndDate,
    eventTimezone,
    services,
    address,
    contact,
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
    if (qrCode.current) {
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

  const handleServiceChange = (service) => (event) => {
    setServices({ ...services, [service]: event.target.checked });
  };

  const handleAddressChange = (field) => (event) => {
    setAddress({ ...address, [field]: event.target.value });
  };

  const handleContactChange = (field) => (event) => {
    setContact({ ...contact, [field]: event.target.value });
  };

  const handleSaveQRCode = async () => {
    const validationErrors = validateFields();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (qrCode.current) {
      try {
        // Get QR code as base64
        const blob = await qrCode.current.getRawData("png");
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result.replace(
            /^data:image\/png;base64,/,
            ""
          );
          setQrImage(base64String); // Set base64 string

          // Prepare form data
          const formData = new FormData();
          formData.append("type", "event");
          formData.append("eventTitle", eventTitle);
          formData.append("eventSummary", eventSummary);
          formData.append("eventStartDate", eventStartDate);
          formData.append("eventEndDate", eventEndDate);
          formData.append("eventTimezone", eventTimezone);
          formData.append("services", JSON.stringify(services));
          formData.append("address", JSON.stringify(address));
          formData.append("contact", JSON.stringify(contact));
          formData.append("dotsColor", dotsColor);
          formData.append("backgroundColor", backgroundColor);
          formData.append("markerBorderColor", markerBorderColor);
          formData.append("markerCenterColor", markerCenterColor);
          formData.append("dotsType", dotsType);
          formData.append("cornersType", cornersType);
          formData.append("cornersDotType", cornersDotType);
          formData.append("qrImageBase64", base64String); // Append base64 string directly

          const token = localStorage.getItem("token");
          await axios.post("http://localhost:8080/api/qrCodes/save", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-auth-token": token,
            },
          });

          navigate("/dashboard");
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error saving QR code:", error);
        alert("Failed to save QR Code. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-lg-6">
          <div className="my-3">
            <h3>Event</h3>
            <label className="form-label">Event Title</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="form-control my-2"
              placeholder="Enter Event Title"
            />
            <label className="form-label">Summary </label>
            <textarea
              value={eventSummary}
              onChange={(e) => setEventSummary(e.target.value)}
              className="form-control my-2"
              placeholder="Enter Event Summary"
            />
            <h3>Details</h3>
            <label htmlFor="" className="form-form-label ">
              Date of the event
            </label>
            <input
              type="date"
              value={eventStartDate}
              onChange={(e) => setEventStartDate(e.target.value)}
              className="form-control my-2"
              placeholder="Enter Start Date"
            />

            <input
              type="date"
              value={eventEndDate}
              onChange={(e) => setEventEndDate(e.target.value)}
              className="form-control my-2"
              placeholder="Enter End Date"
            />
            <input
              type="text"
              value={eventTimezone}
              onChange={(e) => setEventTimezone(e.target.value)}
              className="form-control my-2"
              placeholder="Enter Timezone"
            />
            <div className="my-2">
              <p>Choose the services available at the event</p>
              {Object.keys(services).map((service) => (
                <div key={service} className="form-check">
                  <input
                    type="checkbox"
                    checked={services[service]}
                    onChange={handleServiceChange(service)}
                    className="form-check-input"
                    id={service}
                  />
                  <label htmlFor={service} className="form-check-label">
                    {service.charAt(0).toUpperCase() +
                      service.slice(1).replace(/([A-Z])/g, " $1")}
                  </label>
                </div>
              ))}
            </div>
            <h3>Address</h3>
            <label className="form-label">Street</label>
            <input
              type="text"
              value={address.street}
              onChange={handleAddressChange("street")}
              className="form-control my-2"
              placeholder="Street"
            />
            <label className="form-label">City</label>
            <input
              type="text"
              value={address.city}
              onChange={handleAddressChange("city")}
              className="form-control my-2"
              placeholder="City"
            />
            <label className="form-label">State</label>
            <input
              type="text"
              value={address.state}
              onChange={handleAddressChange("state")}
              className="form-control my-2"
              placeholder="State"
            />
            <label className="form-label">Zip</label>
            <input
              type="text"
              value={address.zip}
              onChange={handleAddressChange("zip")}
              className="form-control my-2"
              placeholder="Zip"
            />
            <label className="form-label">Country</label>
            <input
              type="text"
              value={address.country}
              onChange={handleAddressChange("country")}
              className="form-control my-2"
              placeholder="Country"
            />
            <h3>Contact</h3>
            <label className="form-label">Name</label>
            <input
              type="text"
              value={contact.name}
              onChange={handleContactChange("name")}
              className="form-control my-2"
              placeholder="Name"
            />
            <label className="form-label">Phone</label>
            <input
              type="text"
              value={contact.phone}
              onChange={handleContactChange("phone")}
              className="form-control my-2"
              placeholder="Phone"
            />
            <label className="form-label">Email</label>
            <input
              type="email"
              value={contact.email}
              onChange={handleContactChange("email")}
              className="form-control my-2"
              placeholder="Email"
            />
            <label className="form-label">Website</label>
            <input
              type="text"
              value={contact.website}
              onChange={handleContactChange("website")}
              className="form-control my-2"
              placeholder="Website"
            />
            {errors.length > 0 && (
              <div className="alert alert-danger mt-3">
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  {" "}
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

export default EventQRCode;
