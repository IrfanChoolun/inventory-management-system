import { MySQL } from "@/utils/mysqlUtils";

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  user_role: string;
};

export const UserService = {
  getUsers: async (): Promise<User[]> => {
    const res = await MySQL.runQuery<User[]>(`SELECT * FROM users`);
    return res;
  },
};
