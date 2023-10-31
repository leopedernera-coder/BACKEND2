import { getJSONFromFile, saveJSONToFile } from "../utils.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
class CartManager {
  constructor() {
    this.path = "./src/data/cart.json";
  }
  async addCart() {
    const cartInitial = await getJSONFromFile(this.path);
    let newCart = {
      id: uuidv4(),
      products: [],
      ...cartInitial,
    };
    cartInitial.push(newCart);
    await saveJSONToFile(this.path, cartInitial);
    console.log("cart addded");
    return newCart;
  }
  async getCarts() {
    return await getJSONFromFile(this.path);
  }
  async getCartsByID(id) {
    try {
      const carts = await getJSONFromFile(this.path);
      //console.log("carts", carts);
      const findCart = carts.find((c) => c.id === id);
      //console.log("findCart", findCart);
      return findCart ? findCart : `Product with id: ${id} doesn't exist yet.`;
    } catch (error) {
      throw new Error(`Error ${error.message}`);
    }
  }
  async addProductTocart(cartId, { productId, quantity }) {
    try {
      const carts = await getJSONFromFile(this.path);
      let cartIndex = carts.findIndex((c) => c.id === cartId);
      //console.log("cartIndex", cartIndex);
      if (cartIndex >= 0) {
        //viendo si existe el producto en la carta para agregarlo
        let findedProduct = carts[cartIndex].products.find(
          (p) => p.productId === productId
        );
        //console.log("findedProduct", findedProduct);
        if (!findedProduct) {
          carts[cartIndex].products.push({ productId, quantity });
        } else {
          let findedIndex = carts[cartIndex].products.findIndex(
            (p) => p.productId === productId
          );
          carts[cartIndex].products[findedIndex].quantity =
            carts[cartIndex].products[findedIndex].quantity + quantity;
        }
        await saveJSONToFile(this.path, carts);
      } else {
        console.log("Cart doesn`t exist");
      }
    } catch (error) {
      throw new Error(`Error ${error.message}`);
    }
  }
  async getCartProducts(cartId) {
    try {
      const cart = await this.getCartsByID(cartId);
      return cart != "string"
        ? cart.products
        : { error: "cart doessn`t exist" };
    } catch (error) {
      throw new Error(`Error ${error.message}`);
    }
  }
}
export default CartManager;
