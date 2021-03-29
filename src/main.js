const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
require("electron-reload")(__dirname, "../src");
const ipc = ipcMain;
const { getConnection } = require("../src/static/config/database");

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1500,
    height: 900,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("src/static/index.html");

  ipc.on("minimize", () => {
    win.minimize();
  });

  ipc.on("close", () => {
    win.close();
  });

  ipc.on("maxres", () => {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  });

  win.setMenu(null);
  win.webContents.toggleDevTools(); // Abre el devtools por defecto
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/*sql*/
ipc.handle("get", () => {
  getProducts();
});

function getProducts() {
  const conn = getConnection();
  const sql = "SELECT * FROM product ORDER BY id DESC";

  try {
    conn.query(sql, (error, products) => {
      if (error) {
        console.log(`Hubo un error: ${error}`);
      }

      win.webContents.send("products", products);
    });
  } catch (error) {
    console.log("Error de");
    console.log(err);
  }
}

//add
ipc.handle("add", (e, product) => {
  addProduct(product);
});

function addProduct(product) {
  const conn = getConnection();
  const sql = "INSERT INTO product (name, description, price) VALUES (?, ?, ?)";

  try {
    const { id, name, price, description } = product;
    conn.query(sql, [name, price, description], (error) => {
      if (error) {
        console.log(`Hubo un error: ${error}`);
      }

      getProducts();
    });
  } catch (error) {
    console.log("Error de");
    console.log(err);
  }
}

//edit
ipc.handle("edit", (e, product) => {
  editProduct(product);
});

function editProduct(product) {
  const conn = getConnection();
  const sql =
    "UPDATE product SET name = ?, description = ?, price = ? WHERE id = ?";
  try {
    const { id, name, price, description } = product;
    conn.query(sql, [name, description, price, id], (error) => {
      if (error) {
        console.log(`Hubo un error: ${error}`);
      }

      getProducts();
    });
  } catch (error) {
    console.log("Error de");
    console.log(err);
  }
}

//delete
ipc.handle("delete", (e, product) => {
  deleteProduct(product);
});

function deleteProduct(product) {
  const conn = getConnection();
  const sql = "DELETE FROM product WHERE id = ?";

  try {
    const { id, name, price, description } = product;
    conn.query(sql, id, (error) => {
      if (error) {
        console.log(`Hubo un error: ${error}`);
      }

      getProducts();
    });
  } catch (error) {
    console.log("Error de");
    console.log(err);
  }
}
