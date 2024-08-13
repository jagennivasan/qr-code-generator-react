
export const vCardToQRCodeData = ({
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
  }) => {
    return `BEGIN:VCARD
  VERSION:3.0
  FN:${firstName} ${lastName}
  TEL:${phone}
  TEL;TYPE=CELL:${mobile}
  EMAIL:${email}
  URL:${website}
  ORG:${company}
  TITLE:${jobTitle}
  FAX:${fax}
  ADR:${address};${city};${postcode};${country}
  END:VCARD`;
  };
  