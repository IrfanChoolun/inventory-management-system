import { ipcMain } from "electron";
import bcrypt from "bcryptjs";

export const backendQueries = () => {
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
};
