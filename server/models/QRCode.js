const mongoose = require("mongoose");

const QRCodeSchema = new mongoose.Schema(
  {
    qr_code_id: { type: String, unique: true, required: true },
    type: { type: String, required: true },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    qrImage: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

QRCodeSchema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("QRCode", QRCodeSchema);
