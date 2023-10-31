(function () {
  const socket = io();
  document.getElementById("addProduct").addEventListener("submit", (event) => {
    event.preventDefault();
    const newProduct = {
      title: document.getElementById("titleProduct").value,
      description: document.getElementById("descriptionProduct").value,
      code: document.getElementById("codeProduct").value,
      price: document.getElementById("priceProduct").value,
      stock: document.getElementById("stockProduct").value,
      category: document.getElementById("catProduct").value,
    };
    socket.emit("addProduct", newProduct);
  });
  socket.on("listProducts", (products) => {
    const divProducts = document.getElementById("divRealTimeProducts");
    console.log(divProducts);
    console.log(products);
    divProducts.innerText = "";
    console.log(products);
    products.forEach((p) => {
      const productElement = document.createElement("div");
      productElement.innerHTML = `
        <h3>${p.title}</h3>
        <p>Description: ${p.description}</p>
        <p>Price: ${p.price}</p>
        <p>Stock: ${p.stock}</p>
        <p id="idProd">Id:${p.id}</p>
        `;
      divProducts.appendChild(productElement);
    });
  });
  document
    .getElementById("formProductDelete")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const idToDelete = document.getElementById("idProductDelete").value;
      console.log(idToDelete);
      socket.emit("deleteProductById", idToDelete);
      document.getElementById("idProductDelete").value = "";
      document.getElementById("idProductDelete").focus();
    });
})();
console.log("hola desde el real time products");
