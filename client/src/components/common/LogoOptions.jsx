import React from "react";
import xLogo from "../../assets/x.png"; // Unselect logo
import linkLogo from "../../assets/link.png";
import btcLogo from "../../assets/btc.png";
import emailLogo from "../../assets/email.png";
import locationLogo from "../../assets/location.png";
import menuLogo from "../../assets/menu.png";
import payPalLogo from "../../assets/paypal.png";
import scanMeFrameLogo from "../../assets/scan-me-frame.png";
import scanMeLogo from "../../assets/scan-me.png";
import scanningLogo from "../../assets/scanning-qr-code.png";
import vcardLogo from "../../assets/vcard.png";
import whatsappLogo from "../../assets/whatsapp.png";
import wifiLogo from "../../assets/wifi.png";
import menuFork from "../../assets/menu-fork.png";

const logoOptions = [
  { value: null, img: xLogo }, // Unselect option
  { value: linkLogo, img: linkLogo },
  { value: locationLogo, img: locationLogo },
  { value: emailLogo, img: emailLogo },
  { value: whatsappLogo, img: whatsappLogo },
  { value: wifiLogo, img: wifiLogo },
  { value: vcardLogo, img: vcardLogo },
  { value: payPalLogo, img: payPalLogo },
  { value: btcLogo, img: btcLogo },
  { value: scanMeFrameLogo, img: scanMeFrameLogo },
  { value: scanningLogo, img: scanningLogo },
  { value: menuLogo, img: menuLogo },
  { value: scanMeLogo, img: scanMeLogo },
  { value: menuFork, img: menuFork },
];

const LogoOptions = ({ logo, onLogoSelect, onFileChange }) => {
  return (
    <div>
      <div className="mb-3">
        <p className="mb-2">Upload Logo</p>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="form-control"
        />
      </div>
      <p className="mb-2">Or choose from here:</p>
      <div className="d-flex flex-wrap justify-content-start" style={{ maxWidth: "450px" }}>
        {logoOptions.map((option) => (
          <img
            key={option.value ? option.value : "unselect"}
            src={option.img}
            alt="Logo"
            onClick={() => onLogoSelect(option.value)}
            style={{
              width: 50,
              height: 50,
              margin: 5,
              cursor: "pointer",
              border: logo === option.value ? "2px solid #000" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LogoOptions;
