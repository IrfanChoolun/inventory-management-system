import { v4 as uuidv4 } from "uuid";

export const MySQL = {
  runQuery: async <T>(query: string, values?: unknown[]): Promise<T> => {
    const requestId: string = uuidv4();
    return new Promise<T>((resolve, reject) => {
      window.ipcRenderer.once(requestId, (_, result) => {
        if (result.error) {
          reject(new Error(result.error));
        } else {
          resolve(result as T);
        }
      });
      window.ipcRenderer.send("execute-query", query, values, requestId);
    });
  },
};
