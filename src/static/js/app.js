const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;

const btnMinimize = document.querySelector(".minimizebutton");
const btnMaxRes = document.querySelector(".zoombutton");
const btnClose = document.querySelector(".closebutton");
const productForm = document.getElementById("productForm");
const listProduct = document.getElementById("listProduct");

btnMinimize.addEventListener("click", () => {
  ipc.send("minimize");
});

btnClose.addEventListener("click", () => {
  ipc.send("close");
});

btnMaxRes.addEventListener("click", () => {
  ipc.send("maxres");
});

//objetos
class Product {
  constructor(id, name, price, description) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  getPrice() {
    return this.price;
  }

  setPrice(price) {
    this.price = price;
  }

  getDescription() {
    return this.description;
  }

  setDescriprion(description) {
    this.description = description;
  }
}

//funcionalidad del form
productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("enviado");
});

async function renderGetProducts() {
  await ipc.invoke("get");
}

ipc.on("products", (e, products) => {
  let template = "";
  let product;
  const list = products;

  for (const prod of products) {
    const { id, name, description, price } = prod;
    console.log(
      `Id: ${id}, Name: ${name}, Descriptión: ${description}, Price: ${price}`
    );
    product = new Product(id, name, price, description);
  }
  console.log(product);

  list.forEach((element) => {
    template += `
        <tr>
          <td data-heading="Programming Language">${element.name}</td>
          <td data-heading="Designed by">${element.price}</td>
          <td data-heading="Difficulty">${element.description}</td>
        </tr>
      `;
  });

  listProduct.innerHTML = template;
});

//sql functions
window.onload = function () {
  renderGetProducts();
};
