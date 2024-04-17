import { ipcMain, app, BrowserWindow, shell } from "electron";
import { release } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
const backendQueries = () => {
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
const database = () => {
  const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    user_role: { type: String, required: true }
  });
  const productSchema = new mongoose.Schema({
    sku: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    brand: { type: String, required: true }
  });
  const productVariationSchema = new mongoose.Schema({
    parent_product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock_per_location: { type: Array, required: true },
    min_stock: { type: Number, required: true },
    // location: { type: String, required: true },
    status: { type: Boolean, required: true },
    variations: { type: Object, required: true }
  });
  const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact_info: { type: String, required: true }
  });
  const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    properties: { type: Array, required: true }
  });
  const uri = "mongodb://localhost:27017/aioims";
  mongoose.connect(uri).then(() => console.log("Connected to MongoDB successfully!")).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    app.quit();
  });
  console.log("Database connected successfully");
  ipcMain.on(
    "mongodb-find-query",
    async (event, queryObject) => {
      try {
        const { collection, schemaString, query, projection } = queryObject;
        const schema = selectSchema(schemaString);
        const model = mongoose.model(
          collection,
          schema
        );
        const rawResults = await model.find(query, projection);
        const results = await rawResults.map((result) => {
          return {
            id: result._id.toString(),
            ...result
          };
        });
        event.sender.send("mongodb-find-query-response", {
          results
        });
      } catch (error) {
        console.error("Error running MongoDB query:", error);
        event.sender.send("mongodb-find-query-response", {
          error
        });
      }
    }
  );
  ipcMain.on(
    "mongodb-findProducts-query",
    async (event, queryObject) => {
      try {
        const { collection, schemaString, query, projection } = queryObject;
        const schema = selectSchema(schemaString);
        const model = mongoose.model(
          collection,
          schema
        );
        query._id = { $in: query._id.map((id) => id) };
        const rawResults = await model.find(query, projection);
        console.log("query:", query);
        const results = await rawResults.map((result) => {
          return {
            id: result._id.toString(),
            sku: result.sku,
            name: result.name,
            description: result.description,
            category_id: result.category_id.toString(),
            brand: result.brand
          };
        });
        event.sender.send("mongodb-findProducts-query-response", {
          results
        });
      } catch (error) {
        console.error("Error running MongoDB query:", error);
        event.sender.send("mongodb-findProducts-query-response", {
          error
        });
      }
    }
  );
  ipcMain.on(
    "mongodb-getProductVariants-query",
    async (event, queryObject) => {
      try {
        const { collection, schemaString, query, projection } = queryObject;
        const schema = selectSchema(schemaString);
        const variantModel = mongoose.model(
          collection,
          schema
        );
        const productModel = mongoose.model(
          "products",
          productSchema
        );
        let rawResults;
        if (query.name !== "" && query.name !== void 0) {
          const filter = {
            $or: [
              { name: { $regex: new RegExp(query.name, "i") } },
              { sku: { $regex: new RegExp(query.name, "i") } }
            ]
          };
          rawResults = await variantModel.find(filter, projection);
          if (rawResults.length === 0) {
            const altFilter = {
              $or: [
                {
                  name: {
                    $regex: new RegExp(query.name, "i")
                  }
                },
                {
                  description: {
                    $regex: new RegExp(query.name, "i")
                  }
                },
                {
                  brand: {
                    $regex: new RegExp(query.name, "i")
                  }
                }
              ]
            };
            let parent_prod_result = await productModel.find(altFilter, { _id: 1 }).then(
              (products) => products.map((product) => product._id)
            );
            console.log("parent_prod_result", parent_prod_result);
            if (parent_prod_result.length != 0) {
              query.parent_product_id = {
                $in: parent_prod_result
              };
              delete query.name;
              rawResults = await variantModel.find(
                query,
                projection
              );
            }
          }
        } else {
          delete query.name;
          rawResults = await variantModel.find(query, projection);
        }
        console.log("variantquery", query);
        console.log("variantraw", rawResults);
        const results = await rawResults.map((result) => {
          return {
            id: result._id.toString(),
            parent_product_id: result.parent_product_id.toString(),
            stock_per_location: result.stock_per_location.map(
              (item) => {
                return {
                  location: item.location.toString(),
                  stock: item.stock
                };
              }
            ),
            price: result.price,
            min_stock: result.min_stock,
            status: result.status,
            name: result.name,
            sku: result.sku,
            variations: result.variations
          };
        });
        event.sender.send("mongodb-getProductVariants-query-response", {
          results
        });
      } catch (error) {
        console.error("Error running MongoDB query:", error);
        event.sender.send("mongodb-getProductVariants-query-response", {
          error
        });
      }
    }
  );
  ipcMain.on(
    "mongodb-getProductLocations-query",
    async (event, queryObject) => {
      try {
        const { collection, schemaString, query, projection } = queryObject;
        const schema = selectSchema(schemaString);
        const model = mongoose.model(
          collection,
          schema
        );
        const rawResults = await model.find(query, projection);
        const results = await rawResults.map((result) => {
          return {
            id: result._id.toString(),
            name: result.name,
            address: result.address,
            contact_info: result.contact_info
          };
        });
        event.sender.send(
          "mongodb-getProductLocations-query-response",
          {
            results
          }
        );
      } catch (error) {
        console.error("Error running MongoDB query:", error);
        event.sender.send(
          "mongodb-getProductLocations-query-response",
          {
            error
          }
        );
      }
    }
  );
  ipcMain.on(
    "mongodb-getProductCategories-query",
    async (event, queryObject) => {
      try {
        const { collection, schemaString, query, projection } = queryObject;
        const schema = selectSchema(schemaString);
        const model = mongoose.model(
          collection,
          schema
        );
        const rawResults = await model.find(query, projection);
        console.log("raw", rawResults);
        const results = await rawResults.map((result) => {
          return {
            id: result._id.toString(),
            name: result.name,
            properties: [...result.properties]
          };
        });
        event.sender.send(
          "mongodb-getProductCategories-query-response",
          {
            results
          }
        );
      } catch (error) {
        console.error("Error running MongoDB query:", error);
        event.sender.send(
          "mongodb-getProductCategories-query-response",
          {
            error
          }
        );
      }
    }
  );
  ipcMain.on(
    "mongodb-create-query",
    async (event, queryObject) => {
      try {
        const { collection, schemaString, document } = queryObject;
        const schema = await selectSchema(schemaString);
        const model = await mongoose.model(collection, schema);
        await model.create(document);
        await event.sender.send("mongodb-create-query-response", true);
      } catch (error) {
        console.error("Error running MongoDB query:", error);
        event.sender.send("mongodb-create-query-response", {
          error
        });
      }
    }
  );
  ipcMain.on(
    "mongodb-update-query",
    async (event, queryObject) => {
      try {
        const { collection, schemaString, document } = queryObject;
        const schema = await selectSchema(schemaString);
        const model = await mongoose.model(collection, schema);
        await model.findOneAndUpdate(
          { _id: document.id },
          document,
          {}
        );
        await event.sender.send("mongodb-update-query-response", true);
      } catch (error) {
        console.error("Error running MongoDB query:", error);
        event.sender.send("mongodb-update-query-response", {
          error
        });
      }
    }
  );
  ipcMain.on(
    "mongodb-delete-query",
    async (event, queryObject) => {
      try {
        const { collection, schemaString, document } = queryObject;
        const schema = await selectSchema(schemaString);
        const model = await mongoose.model(collection, schema);
        await model.findByIdAndDelete({ _id: document.id });
        await event.sender.send("mongodb-delete-query-response", true);
      } catch (error) {
        console.error("Error running MongoDB query:", error);
        event.sender.send("mongodb-delete-query-response", {
          error
        });
      }
    }
  );
  function selectSchema(schemaString) {
    if (schemaString === "UserSchema") {
      return userSchema;
    } else if (schemaString === "ProductSchema") {
      return productSchema;
    } else if (schemaString === "ProductVariationSchema") {
      return productVariationSchema;
    } else if (schemaString === "LocationSchema") {
      return LocationSchema;
    } else if (schemaString === "CategorySchema") {
      return CategorySchema;
    } else {
      throw new Error(`Unsupported schema: ${schemaString}`);
    }
  }
};
database();
backendQueries();
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
    win == null ? void 0 : win.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
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
