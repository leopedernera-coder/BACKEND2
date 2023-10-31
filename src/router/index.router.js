import { Router } from "express";
import ProductManager from "../clases/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();

  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  console.log(products);

  res.render("realTimeProducts", { products });
});

export default router;
