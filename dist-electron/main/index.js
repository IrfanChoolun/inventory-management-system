import { dialog, app, ipcMain, BrowserWindow, shell } from "electron";
import { release } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
const databaseConfig = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: void 0,
  DATABASE: "my_electron_app"
};
const setupDatabase = () => {
  const connection = mysql.createConnection({
    host: databaseConfig.HOST,
    user: databaseConfig.USER,
    password: databaseConfig.PASSWORD,
    database: databaseConfig.DATABASE
  });
  connection.connect((error) => {
    if (error) {
      console.error("Database connection failed: ", error);
      dialog.showErrorBox("Database connection failed", error.message);
      app.quit();
    } else {
      console.log("Database connected successfully");
    }
  });
  ipcMain.on(
    "execute-query",
    async (event, query, values, requestId) => {
      connection.query(query, values, (error, results) => {
        if (error) {
          event.reply(requestId, {
            error: error.message || "Unknown error"
          });
        }
        event.reply(requestId, results);
      });
    }
  );
};
const userQueries = () => {
  async function validatePassword(password, hash) {
    let passwordMatch = await bcrypt.compare(password, hash);
    if (passwordMatch) {
      return { success: true };
    } else {
      return { success: false };
    }
  }
  ipcMain.on("validatePassword", async (event, password, hashedPassword) => {
    const validPassword = await validatePassword(password, hashedPassword);
    event.sender.send("validatePasswordResponse", validPassword);
  });
  function hashPassword(password) {
    return bcrypt.hash(password, 10);
  }
  ipcMain.on("hashPassword", async (event, password) => {
    const hashedPassword = await hashPassword(password);
    event.sender.send("hashedPasswordGenerated", hashedPassword);
  });
};
setupDatabase();
userQueries();
globalThis.__filename = fileURLToPath(import.meta.url);
globalThis.__dirname = dirname(__filename);
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, "../public") : process.env.DIST;
if (release().startsWith("6.1"))
  app.disableHardwareAcceleration();
if (process.platform === "win32")
  app.setAppUserModelId(app.getName());
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
let win = null;
const preload = join(__dirname, "../preload/index.mjs");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");
async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    }
  });
  if (url) {
    win.loadURL(url);
    win.maximize();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
    win == null ? void 0 : win.webContents.send("clear-storage");
  });
  win.webContents.setWindowOpenHandler(({ url: url2 }) => {
    if (url2.startsWith("https:"))
      shell.openExternal(url2);
    return { action: "deny" };
  });
}
app.whenReady().then(createWindow);
app.on("window-all-closed", async () => {
  win = null;
  if (process.platform !== "darwin")
    app.quit();
});
app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized())
      win.restore();
    win.focus();
  }
});
app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
//# sourceMappingURL=index.js.map
