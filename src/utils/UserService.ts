import { MySQL } from "@/utils/services/mysqlUtils";

export type User = {
  id?: number;
  first_name?: string;
  last_name?: string;
  user_role?: string;
  username?: string;
  password?: string;
};

export type LoginResponse = {
  error?: string | undefined;
  success?: boolean | undefined;
  user?: User | undefined;
};

export const UserService = {
  getUsers: async (): Promise<User[]> => {
    const res = await MySQL.runQuery<User[]>(`SELECT * FROM users`);
    return res;
  },
  userLogin: async (
    username: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const user = await MySQL.runQuery<User[]>(
        `SELECT * FROM users WHERE username = ?`,
        [username]
      );

      if (user.length === 0) {
        return { error: "Invalid username" };
      }

      const response = await new Promise<LoginResponse>((resolve) => {
        window.ipcRenderer.send("validatePassword", password, user[0].password);
        window.ipcRenderer.once("validatePasswordResponse", (_, response) => {
          resolve(response);
        });
      });

      if (response.success) {
        return {
          success: true,
          user: {
            id: user[0].id,
            first_name: user[0].first_name,
            last_name: user[0].last_name,
            user_role: user[0].user_role,
            username: user[0].username,
          },
        };
      } else {
        return { success: false, error: response.error || "Invalid password" };
      }
    } catch (err) {
      console.error("Login Error:", err);
      return { success: false, error: "Internal Server Error" };
    }
  },
  // addUser: async (user: User): Promise<string | undefined> => {
  //   try {
  //     window.ipcRenderer.send("hashPassword", user.password);
  //     window.ipcRenderer.once(
  //       "hashedPasswordGenerated",
  //       async (_, hashedPassword) => {
  //         const res = await MySQL.runQuery<User>(
  //           `INSERT INTO users (username, password, first_name, last_name, user_role) VALUES (?, ?, ?, ?, ?)`,
  //           [
  //             user.username,
  //             hashedPassword,
  //             user.first_name,
  //             user.last_name,
  //             user.user_role,
  //           ]
  //         );
  //         return res;
  //       }
  //     );
  //   } catch (err: any) {
  //     console.error("Error adding user:", err);
  //     return undefined;
  //   }
  // },
};
