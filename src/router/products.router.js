import { Router } from "express";
import ProductManager from "../clases/ProductManager.js";

const productManager = new ProductManager();

const router = Router();
// Camino fácil del post
// router.post("/", async (req, res) => {
//   await productManager.addProduct(req.body);
//   res.status(201).json(req.body);
// });
//Camino de la muerte del Post
router.post("/", async (req, res) => {
  const { title, description, code, price, stock, category, thumbnail } =
    req.body;
  try {
    console.log(req.body);
    if (
      !(title && description && price && thumbnail && code && stock && category)
    ) {
      return res.status(400).json({ error: `some data is missing` });
    }
    const newProduct = {
      ...req.body,
    };
    const addedProduct = await productManager.addProduct(newProduct);
    if (typeof addedProduct !== "string") {
      console.log(addedProduct);
      console.log(`Product added`);
      res.status(201).send(newProduct);
    } else {
      return res.status(400).json({ error: "Product already exist" });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
});
router.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts();
  if (!limit) {
    res.status(200).json(products);
  } else {
    const limitedProducts = products.slice(0, parseInt(limit));
    res.status(200).json(limitedProducts);
  }
});
router.get("/:pID", async (req, res) => {
  const { pID } = req.params;
  const product = await productManager.getProductById(pID);
  return product
    ? res.status(200).json(product)
    : res.status(404).json({ error: `Product with id: ${pID} doesn't exist` });
});

router.put("/:pID", async (req, res) => {
  const { pID } = req.params;
  const {
    title,
    description,
    status,
    code,
    price,
    stock,
    category,
    thumbnail,
  } = req.body;
  try {
    let product = await productManager.getProductById(pID);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }
    if (typeof product !== "string") {
      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price || product.price;
      product.thumbnail = thumbnail || product.thumbnail;
      product.code = code || product.code;
      product.status = status !== undefined ? status : product.status;
      product.category = category || product.category;
      product.stock = stock || product.stock;
    }
    await productManager.updateProduct(product);
    return res.status(200).send(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/:pID", async (req, res) => {
  const { pID } = req.params;
  await productManager.deleteProduct(pID);
  res.status(200).json({ message: "product deleted successfull" });
});

export default router;
