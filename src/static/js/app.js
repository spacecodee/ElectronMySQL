const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;

const btnMinimize = document.querySelector(".minimizebutton");
const btnMaxRes = document.querySelector(".zoombutton");
const btnClose = document.querySelector(".closebutton");
const productForm = document.getElementById("productForm");
const listProduct = document.getElementById("listProduct");

const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productDescription = document.getElementById("productDescription");
const inputs = document.querySelectorAll(
  ".window .content .wrapper .form .inputfield input"
);
const btnAdd = document.getElementById("btnAdd");

const modal_container = document.getElementById("modal_container");
const close = document.getElementById("close");
const acept = document.getElementById("acept");
const btnClearInputs = document.getElementById("btnClearInputs");

const modalH1 = document.querySelector(".modal h1");
const modalP = document.querySelector(".modal p");

let produ = [],
  edit = false,
  nameProduct,
  descriptionProduct,
  priceProduct,
  idProduct;

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
  if (!validateForm()) {
    if (!edit) {
      addProduct();
      productForm.reset();
    } else {
      if (editProduct()) {
        console.log("Reset");
      }
    }

    renderGetProducts();
  }
});

btnClearInputs.addEventListener("click", (e) => {
  e.preventDefault();
  productForm.reset();
  edit = false;
  btnAdd.innerText = "Add Product";
});

async function renderGetProducts() {
  await ipc.invoke("get");
}

async function addProduct() {
  nameProduct = productName.value;
  descriptionProduct = productDescription.value;
  priceProduct = productPrice.value;

  edit = false;
  const product = new Product(
    null,
    nameProduct,
    descriptionProduct,
    priceProduct
  );
  await ipc.invoke("add", product);
}

ipc.on("products", (e, products) => {
  let template = "";
  const list = products;

  for (const prod of products) {
    produ = products;
  }

  list.forEach((element) => {
    template += `
        <tr>
          <td>${element.name}</td>
          <td>${element.description}</td>
          <td>${element.price}</td>
          <td>
            <button type="submit" class="btn-edit" onClick="getEditProduct(
              ${element.id}, '${element.name}', '${element.description}', ${element.price}
            )">
              Edit
            </button>

            <button type="submit" class="btn-delete" onClick="getIdProduct(${element.id})">
              Delete
            </button>
          </td>
        </tr>
      `;
  });

  listProduct.innerHTML = template;
});

function validateForm() {
  let ok = true;
  inputs.forEach((e) => {
    if (e.value.trim().length === 0) {
      e.classList.add("warning");
      ok = true;
    } else {
      e.classList.remove("warning");
      ok = false;
    }
  });

  return ok;
}

function getEditProduct(id, name, description, price) {
  edit = true;
  btnAdd.innerText = "Edit Product";

  productName.value = name;
  productDescription.value = description;
  productPrice.value = price;

  idProduct = id;
}

function editProduct() {
  nameProduct = productName.value;
  descriptionProduct = productDescription.value;
  priceProduct = productPrice.value;

  const product = new Product(
    idProduct,
    nameProduct,
    priceProduct,
    descriptionProduct
  );

  if (loadModal()) {
    modalH1.innerHTML = "Edit Product";
    modalP.innerHTML = "Are you sure you want to edit it?";

    acept.addEventListener("click", async (e) => {
      await ipc.invoke("edit", product);
      modal_container.classList.remove("show");
      btnAdd.innerText = "Add Product";
      productForm.reset();
      return true;
    });
  } else {
    return false;
  }

  edit = false;
}

function loadModal() {
  if (btnAdd.click) {
    modal_container.classList.add("show");
    return true;
  } else {
    modal_container.classList.remove("show");
    return false;
  }
}

close.addEventListener("click", () => {
  modal_container.classList.remove("show");
  btnAdd.innerText = "Add Product";
  productForm.reset();
});

function getIdProduct(id) {
  idProduct = id;
  deleteProduct();
}

async function deleteProduct() {
  const product = new Product(
    idProduct,
    nameProduct,
    priceProduct,
    descriptionProduct
  );

  if (loadModal()) {
    modalH1.innerHTML = "Delete Product";
    modalP.innerHTML = "Are you sure you want to delete it?";
    acept.addEventListener("click", async (e) => {
      await ipc.invoke("delete", product);
      modal_container.classList.remove("show");
      btnAdd.innerText = "Add Product";
      productForm.reset();
    });
  }
}

//sql functions
window.onload = function () {
  renderGetProducts();
};
