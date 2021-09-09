const mongoose = require("mongoose");

const salesSchema = mongoose.Schema(
  {
    products: [
      {
        product_id: { type: String },
        amount: { type: String },
        price: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", salesSchema);

module.exports = Sale;
