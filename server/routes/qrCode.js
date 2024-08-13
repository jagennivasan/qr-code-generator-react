const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const QRCode = require("../models/QRCode");
const auth = require("../middleware/auth");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/save", auth, upload.none(), async (req, res) => {
  try {
    const { type, qrImageBase64, ...data } = req.body;
    const uploadDir = path.join(__dirname, "../uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let qrImage = "";
    if (qrImageBase64 && typeof qrImageBase64 === "string") {
      const base64Data = qrImageBase64.replace(/^data:image\/png;base64,/, "");
      const fileName = Date.now() + ".png";
      const filePath = path.join(uploadDir, fileName);

      fs.writeFile(filePath, base64Data, "base64", async (err) => {
        if (err)
          return res.status(500).json({ error: "Error saving QR code image" });

        qrImage = `uploads/${fileName}`;

        const newQRCode = new QRCode({
          user: req.user._id,
          qr_code_id:
            "qr_" + Date.now() + Math.random().toString(36).substr(2, 9),
          type,
          data,
          qrImage,
        });

        try {
          await newQRCode.save();
          res
            .status(201)
            .json({ message: "QR Code saved successfully", data: newQRCode });
        } catch (error) {
          console.error("Error saving QR code:", error);
          res.status(500).json({ error: "Error saving QR code" });
        }
      });
    } else {
      return res
        .status(400)
        .json({ error: "Invalid qrImageBase64 format or missing" });
    }
  } catch (error) {
    console.error("Error saving QR code:", error);
    res.status(500).json({ error: "Error saving QR code" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const qrCodes = await QRCode.find({ user: req.user._id });
    res.json(qrCodes);
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    res.status(500).json({ error: "Error fetching QR codes" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);
    if (!qrCode) {
      return res.status(404).json({ error: "QR Code not found" });
    }

    if (qrCode.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const filePath = path.join(__dirname, "../", qrCode.qrImage);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await qrCode.deleteOne();
    res.json({ message: "QR Code deleted successfully" });
  } catch (error) {
    console.error("Error deleting QR code:", error);
    res.status(500).json({ error: "Error deleting QR code" });
  }
});

module.exports = router;
