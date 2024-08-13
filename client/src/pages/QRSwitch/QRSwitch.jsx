import React from "react";
import {
  FaLink,
  FaWhatsapp,
  FaWifi,
  FaPaypal,
  FaFilePdf,
  FaImages,
  FaPlayCircle,
  FaShareAlt,
} from "react-icons/fa";
import { FaCommentSms } from "react-icons/fa6";
import { MdEmail, MdCall, MdOutlinePhoneAndroid } from "react-icons/md";
import { CiTextAlignJustify } from "react-icons/ci";
import { BsPersonVcard } from "react-icons/bs";
import { BsFillCalendar2EventFill } from "react-icons/bs";
import { useState } from "react";

import LinkQRCode from "../../components/features/LinkQRCode";
import EmailQRCode from "../../components/features/EmailQRCode";
import TextQRCode from "../../components/features/TextQRCode";
import CallQRCode from "../../components/features/CallQRCode";
import SMSQRCode from "../../components/features/SMSQRCode";
import VCardQRCode from "../../components/features/VCarQRCode";
import WhatsappQRCode from "../../components/features/WhatsAppQRCode";
import WifiQRCode from "../../components/features/WifiQRCode";
import PayPalQRCode from "../../components/features/PayPalQRCode";
import EventQRCode from "../../components/features/EventQRCode";
import PDFQRCode from "../../components/features/PDFQRCode";
import AppQRCode from "../../components/features/AppQRCode";
import ImageQRcode from "../../components/features/ImageQRCode";
import VideoQRCode from "../../components/features/VideoQRCode";
import SocialMediaQRCode from "../../components/features/SocialMediaQRCode";
const QRSwitch = () => {
  const [activeComponent, setActiveComponent] = useState("link");
  const toggleComponent = (component) => {
    setActiveComponent(component);
  };
  return (
    <div className="container " style={style.container}>
      <div className="text-center bg-light " style={window.innerWidth <= 768 ? mobileStyle.grid : style.grid}>
        <a
          onClick={() => toggleComponent("link")}
          className={`nav-link p-3 ${
            activeComponent === "link" ? "active" : ""
          }`}
          style={activeComponent === "link" ? style.active : {}}
        >
          <FaLink className="mx-2" />
          Link
        </a>
        <a
          onClick={() => toggleComponent("email")}
          className={`nav-link p-3 ${
            activeComponent === "email" ? "active" : ""
          }`}
          style={activeComponent === "email" ? style.active : {}}
        >
          <MdEmail className="mx-2" /> E-mail
        </a>
        <a
          onClick={() => toggleComponent("text")}
          className={`nav-link p-3 ${
            activeComponent === "text" ? "active" : ""
          }`}
          style={activeComponent === "text" ? style.active : {}}
        >
          <CiTextAlignJustify className="mx-2" /> Text
        </a>
        <a
          onClick={() => toggleComponent("call")}
          className={`nav-link p-3 ${
            activeComponent === "call" ? "active" : ""
          }`}
          style={activeComponent === "call" ? style.active : {}}
        >
          <MdCall className="mx-2" /> Call
        </a>
        <a
          onClick={() => toggleComponent("sms")}
          className={`nav-link p-3 ${
            activeComponent === "sms" ? "active" : ""
          }`}
          style={activeComponent === "sms" ? style.active : {}}
        >
          <FaCommentSms className="mx-2" /> SMS
        </a>
        <a
          onClick={() => toggleComponent("vcard")}
          className={`nav-link p-3 ${
            activeComponent === "vcard" ? "active" : ""
          }`}
          style={activeComponent === "vcard" ? style.active : {}}
        >
          <BsPersonVcard className="mx2" /> V-card
        </a>
        <a
          onClick={() => toggleComponent("whatsapp")}
          className={`nav-link p-3 ${
            activeComponent === "whatsapp" ? "active" : ""
          }`}
          style={activeComponent === "whatsapp" ? style.active : {}}
        >
          <FaWhatsapp className="mx-2" /> whatsapp
        </a>
        <a
          onClick={() => toggleComponent("wifi")}
          className={`nav-link p-3 ${
            activeComponent === "wifi" ? "active" : ""
          }`}
          style={activeComponent === "wifi" ? style.active : {}}
        >
          <FaWifi className="mx-2" /> Wi-Fi
        </a>
        <a
          onClick={() => toggleComponent("paypal")}
          className={`nav-link p-3 ${
            activeComponent === "paypal" ? "active" : ""
          }`}
          style={activeComponent === "paypal" ? style.active : {}}
        >
          <FaPaypal className="mx-2" /> PayPal
        </a>
        <a
          onClick={() => toggleComponent("event")}
          className={`nav-link p-3  ${
            activeComponent === "event" ? "active" : ""
          }`}
          style={activeComponent === "event" ? style.active : {}}
        >
          <BsFillCalendar2EventFill className="mx-2" /> Event
        </a>
        <a
          onClick={() => toggleComponent("pdf")}
          className={`nav-link p-3 ${
            activeComponent === "pdf" ? "active" : ""
          }`}
          style={activeComponent === "pdf" ? style.active : {}}
        >
          <FaFilePdf className="mx-2" /> PDF
        </a>
        <a
          onClick={() => toggleComponent("app")}
          className={`nav-link p-3 ${
            activeComponent === "app" ? "active" : ""
          }`}
          style={activeComponent === "app" ? style.active : {}}
        >
          <MdOutlinePhoneAndroid className="mx-2" /> App
        </a>
        <a
          onClick={() => toggleComponent("image")}
          className={`nav-link p-3 ${
            activeComponent === "image" ? "active" : ""
          }`}
          style={activeComponent === "image" ? style.active : {}}
        >
          <FaImages className="mx-2" /> Image
        </a>
        <a
          onClick={() => toggleComponent("video")}
          className={`nav-link p-3 ${
            activeComponent === "video" ? "active" : ""
          }`}
          style={activeComponent === "video" ? style.active : {}}
        >
          <FaPlayCircle className="mx-2" /> video
        </a>
        <a
          onClick={() => toggleComponent("social")}
          className={`nav-link p-3 ${
            activeComponent === "social" ? "active" : ""
          }`}
          style={activeComponent === "social" ? style.active : {}}
        >
          <FaShareAlt className="mx-2" /> Social Media
        </a>
      </div>
      <div>
        {activeComponent === "link" && <LinkQRCode />}
        {activeComponent === "email" && <EmailQRCode />}
        {activeComponent === "text" && <TextQRCode />}
        {activeComponent === "call" && <CallQRCode />}
        {activeComponent === "sms" && <SMSQRCode />}
        {activeComponent === "vcard" && <VCardQRCode />}
        {activeComponent === "whatsapp" && <WhatsappQRCode />}
        {activeComponent === "wifi" && <WifiQRCode />}
        {activeComponent === "paypal" && <PayPalQRCode />}
        {activeComponent === "event" && <EventQRCode />}
        {activeComponent === "pdf" && <PDFQRCode />}
        {activeComponent === "app" && <AppQRCode />}
        {activeComponent === "image" && <ImageQRcode />}
        {activeComponent === "video" && <VideoQRCode />}
        {activeComponent === "social" && <SocialMediaQRCode />}
      </div>
    </div>
  );
};

const style = {
  container: {
    backgroundColor: "#eeeeee",
    border: "1px solid #e9ecef",
    padding: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)", 
    gridTemplateRows: "repeat(3, auto)",  
    gap: "1rem",
    width: "100%",
    cursor: "pointer",
    padding: "1rem",
  },
  navLink: {
    display: "inline-block",
    padding: "0.75rem",
    cursor: "pointer",
    textDecoration: "none",
    color: "black",
  },
  active: {
    backgroundColor: "#cccccc",
    color: "green",
  },
};
const mobileStyle = {
  ...style,
  grid: {
    ...style.grid,
    gridTemplateColumns: "repeat(3, 1fr)", 
    gridTemplateRows: "repeat(5, auto)",  
  },
};

export default QRSwitch;
