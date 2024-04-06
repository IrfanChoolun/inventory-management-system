import { ipcMain } from "electron";

import crypto from "crypto";
import bcrypt from "bcryptjs";

export const backendQueries = () => {
  // generateSessionToken
  //   function generateSessionToken(): Promise<string> {
  //     return new Promise((resolve, reject) => {
  //       crypto.randomBytes(32, (err: Error | null, buffer: Buffer) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           const token = buffer.toString("hex");
  //           resolve(token);
  //         }
  //       });
  //     });
  //   }

  //   ipcMain.on("generateSessionToken", async (event) => {
  //     const token = await generateSessionToken();
  //     event.sender.send("sessionTokenGenerated", token);
  //   });

  async function validatePassword(
    password: string,
    hash: string
  ): Promise<{ success: boolean }> {
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

  function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  ipcMain.on("hashPassword", async (event, password) => {
    const hashedPassword = await hashPassword(password);
    event.sender.send("hashedPasswordGenerated", hashedPassword);
  });

  //   ipcMain.on("viewUsers", async (event, password) => {
  //     const hashedPassword = await viewUsers(password);
  //     event.sender.send("hashedPasswordGenerated", hashedPassword);
  //   });
};
