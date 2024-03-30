import { app, dialog, ipcMain } from "electron";
import databaseConfig from "./database.config";
import mysql from "mysql2";

export const setupDatabase = () => {
  const connection = mysql.createConnection({
    host: databaseConfig.HOST,
    user: databaseConfig.USER,
    password: databaseConfig.PASSWORD,
    database: databaseConfig.DATABASE,
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
    async (event, query: string, values: unknown[], requestId: string) => {
      connection.query(query, values, (error, results) => {
        if (error) {
          event.reply(requestId, {
            error: error.message || "Unknown error",
          });
        }
        event.reply(requestId, results);
      });
    }
  );
};
