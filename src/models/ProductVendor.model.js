// models/ProductVendor.model.js
import mongoose from "mongoose";

const productVendorSchema = new mongoose.Schema({
  shopName: { type: String, required: true, trim: true, maxlength: 100 },
  productType: { type: String, required: true, trim: true, maxlength: 100 },
  cost: { type: Number, required: true, min: 0 },
  rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
  action: { type: String, enum: ["Approve", "Dis Approved", "Block", "Dropdown"], default: "Dropdown" },
  reason: { type: String, trim: true, maxlength: 500 },
  user: { type: mongoose.Schema.Types.ObjectId, refPath: "userType", required: true },
  userType: { type: String, required: true, enum: ["User", "Admin"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ProductVendor = mongoose.model("ProductVendor", productVendorSchema);
export default ProductVendor;
