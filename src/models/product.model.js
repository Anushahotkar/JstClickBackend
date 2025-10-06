import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory", required: true },
  cost: { type: Number, required: true },
  description: { type: String, default: "" },
  image: { type: String, required: true }, // single image
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "userType",  // dynamic reference: can point to User or Admin
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["User", "Admin"],
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
