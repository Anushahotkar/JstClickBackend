import express from "express";
import { getOrdersController } from "../controllers/productOrder.controller.js";


const router = express.Router();



router.get("/orders", getOrdersController);

export default router;
