import { Router } from "express";
import CartManager from "../clases/CartManager.js";
import ProductManager from "../clases/ProductManager.js";

const router = Router();
const carts = new CartManager();
const productManager = new ProductManager();

router.post("/", async (req, res) => {
  res.send(await carts.addCart());
});

router.get("/", async (req, res) => {
  const allCarts = await carts.getCarts();
  return res.status(200).json({ carts: allCarts });
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cartId = await carts.getCartById(cid);
  cartId
    ? res.status(201).json({ cart: cartId })
    : res.status(404).json({ error: `Cart with id: ${cid} doesn't exist` });
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity;
  try {
    let product = await productManager.getProductById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ error: `Product with id: ${pid} doesn't exist` });
    }
    let cart = await carts.getCartsByID(cid);
    // console.log(cart);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `Cart with id: ${cid} doesn't exist` });
    }
    await carts.addProductTocart(cid, { productId: pid, quantity });
    cart = await carts.getCartsByID(cid);
    return res.status(200).json({ data: cart });
  } catch (error) {
    return res.status(500).json({ error: `${error.message}` });
  }
});

export default router;
