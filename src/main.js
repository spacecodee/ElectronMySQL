const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
require("electron-reload")(__dirname, "../src");
const ipc = ipcMain;
const { getConnection } = require("../src/static/config/database");

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
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

//sql
ipcMain.handle("get", () => {
  getProducts();
});

function getProducts() {
  const conn = getConnection();
  const sql = "SELECT * FROM product";
  conn.query(sql, (error, products, fields) => {
    if (error) {
      console.log(error);
    }

    console.log("******");
    console.log(products);
    console.log("------------");

    win.webContents.send("products", products);
  });
}
