/*productOrder.model.js*/

import mongoose from "mongoose";

const productOrderSchema = new mongoose.Schema({
  // Reference to the product being ordered
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  
  // ✅ Updated vendor field to support both User and Admin
  // Reference to the vendor who provides the product
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'vendorType', // Dynamic reference based on the vendorType field
    required: true,
  },

  // The model name for the vendor reference
  vendorType: {
    type: String,
    required: true,
    enum: ["User", "Admin"], // Vendor can be a User or an Admin
  },
  
  // Reference to the customer who placed the order
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  // The name of the product at the time of order
  productName: {
    type: String,
    required: true,
  },
  
  // The quantity of the product ordered
  quantity: {
    type: String, // Stored as a string to accommodate units like "5kg"
    required: true,
  },
  
  // The cost of the product at the time of order
  cost: {
    type: Number,
    required: true,
  },
  
  // The date the order was placed
  orderedOn: {
    type: Date,
    required: true,
  },
  
  // The current status of the order
  status: {
    type: String,
    required: true,
    enum: ["Upcoming", "Out for Delivery", "Delivered", "Cancelled", "Not Delivered"],
    default: "Upcoming",
  },
  
  // Automatically generated timestamp for creation
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
{
  timestamps: true,
});

export default mongoose.model("ProductOrder", productOrderSchema);