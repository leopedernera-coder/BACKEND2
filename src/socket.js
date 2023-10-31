import { Server } from "socket.io";
import ProductManager from "./clases/ProductManager.js";

let io;

const productManager = new ProductManager();
const products = await productManager.getProducts();

export const init = (httpServer) => {
  io = new Server(httpServer);
  io.on("connection", async (socketClient) => {
    console.log("Cliente conectado 💪 ", socketClient.id);

    socketClient.emit("listProducts", products);
    socketClient.on("addProduct", async (newProduct) => {
      await productManager.addProduct(newProduct);
      // console.log(products);
      io.emit("listProducts", products);
    });
    socketClient.on("deleteProductById", async (idToDelete) => {
      await productManager.deleteProduct(idToDelete);
      io.emit("listProducts", products);
    });
    socketClient.on("disconnect", () => {
      console.log(`Se ha desconectado el cliente : ${socketClient.id} 😔`);
    });
  });

  console.log("server socket running");
};

// export const emitData = (event, data) => io.emit(event, data);
