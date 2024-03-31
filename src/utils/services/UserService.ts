import { MySQL } from "@/utils/mysqlUtils";

export type User = {
  id?: number;
  first_name?: string;
  last_name?: string;
  user_role?: string;
  username?: string;
  password?: string;
};

export type LoginResponse = {
  error?: string;
  success?: boolean;
  token?: string;
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
        return { error: "Invalid username or password" };
      }

      const validPassword: any = window.ipcRenderer.invoke(
        "validatePassword",
        password,
        user[0].password
      );

      if (validPassword) {
        const token: any = window.ipcRenderer.invoke("generateSessionToken");
        return { success: true, token: token || "" };
      } else {
        return { error: "Invalid username or password" };
      }
    } catch (err) {
      return { error: "Internal server error" };
    }
  },
  addUser: async (user: User): Promise<User> => {
    const hashedPassword = window.ipcRenderer.invoke(
      "hashPassword",
      user.password
    );
    const res = await MySQL.runQuery<User>(
      `INSERT INTO users (username, password, first_name, last_name, user_role) VALUES (?, ?, ?, ?, ?)`,
      [
        user.username,
        hashedPassword,
        user.first_name,
        user.last_name,
        user.user_role,
      ]
    );
    return res;
  },
};
