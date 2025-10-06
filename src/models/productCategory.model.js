// models/productCategory.model.js
import mongoose from "mongoose";

const productCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" }, // Image URL
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'creatorModel', 
    required: true 
  }, // Reference to creator (Admin/User)
  creatorModel: { 
    type: String, 
    enum: ['Admin', 'User'], 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ProductCategory", productCategorySchema);
