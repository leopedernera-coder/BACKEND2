import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import routerProducts from "./router/products.router.js";
import routerCarts from "./router/cart.router.js";
import homeRouter from "./router/index.router.js";
import { __dirname } from "./utils.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.get("/", homeRouter);
app.get("/realTimeProducts", homeRouter);
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);

app.use((error, req, res, next) => {
  const message = `Ah ocurrido un error desconocido 😨: ${error.message}`;
  console.log(message);
  res.status(500).json({ status: "error", message });
});

export default app;
