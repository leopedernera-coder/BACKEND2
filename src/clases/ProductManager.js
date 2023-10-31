import { getJSONFromFile, saveJSONToFile } from "../utils.js";
import { v4 as uuidv4 } from "uuid";
class ProductManager {
  constructor() {
    this.path = "./src/products.json";
  }
  async getProducts() {
    return await getJSONFromFile(this.path);
  }
  async addProduct({
    title,
    description,
    price,
    // thumbnail,
    code,
    stock,
    category,
  }) {
    if (!(title && description && price && code && stock && category)) {
      throw new Error("Data is missing, please check it");
    }
    try {
      const products = await this.getProducts();
      console.log(products);
      const codeExist = products.find((product) => product.code === code);
      if (!codeExist) {
        const newProduct = {
          id: uuidv4(),
          title,
          description,
          price,

          code,
          stock,
        };
        products.push(newProduct);
        await saveJSONToFile(this.path, products);
        return newProduct;
      } else {
        console.log(`The product with code:${code} already exist.`);
        return;
      }
    } catch (error) {
      throw new Error(`Error ${error.message}`);
    }
  }
  async getProductById(id) {
    const products = await getJSONFromFile(this.path);
    const findProduct = products.find((product) => product.id === id);
    return findProduct
      ? findProduct
      : `Product with id: ${id} doesn't exist yet.`;
  }
  async updateProduct({
    id,
    title,
    description,
    price,
    status,
    category,
    thumbnail,
    code,
    stock,
  }) {
    //Si no pasan un ID por parametro manejo erorr
    if (!id) {
      throw new Error(`you must provide us with an id⛔`);
    }
    //Traigo el array de productos pata manejarlo
    const data = await getJSONFromFile(this.path);
    //Verifico que no exista otro producto con !== ID (que el que están pasando),
    // que tenga el mismo código que estan pasando para actualizar,
    //ya que no pueden haber 2 productos con el mismo código
    let findCodeRepeat = data.find(
      (product) => product.code === code && product.id !== id
    );
    if (findCodeRepeat) {
      throw new Error(
        `The provided code ${findCode.code} already exist in other product, you can't update`
      );
    }
    //Llamo al producto que tiene ese ID que pasan por parametros
    let product = await this.getProductById(id);

    //Creo una ciclo que verifica la condición, si devuelve = string = no se encontro el producto = error => voy al else
    // : si devuelve el producto sigue el if
    if (typeof product !== "string") {
      //le paso los nuevos valores al producto, creo una condición x cada key,
      //que si no esta pasando un nuevo valor => se mantenga el original
      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price || product.price;
      product.thumbnail = thumbnail || product.thumbnail;
      product.status = status !== undefined ? status : product.status;
      product.category = category || product.category;
      product.code = code || product.code;
      product.stock = stock || product.stock;

      //aca encuentro la posición en el array del producto que quiere actualizar
      const productIndex = data.findIndex((product) => product.id === id);
      // actualizo el producto que me indican por ID, con la nueva data
      data[productIndex] = product;
      //vuelvo a escribir el JSON con los productos actualizados, y los que ya estaban se mantienen
      await saveJSONToFile(this.path, data);
    } else {
      console.log(
        `Doesn't exist product with ID:${id}, try with other product `
      );
    }
  }
  async deleteProduct(id) {
    if (!id) {
      throw new Error(`you must provide us with an id⛔`);
    }
    let product = await this.getProductById(id);

    if (typeof product !== "string") {
      let products = await getJSONFromFile(this.path);
      products = products.filter((product) => product.id !== id);
      saveJSONToFile(this.path, products);
      console.log(`Product with id:${id} was deleted`);
      return products;
    } else {
      throw new Error(
        `You can't delet this product with id:${id} beacause doesn't exist yet.`
      );
    }
  }
}

export default ProductManager;
