// import { MongoDb } from "@/utils/services/MongoDbUtils";
import mongoose from "mongoose";

export type User = {
	id?: mongoose.Types.ObjectId;
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
		const response = await new Promise<any>((resolve) => {
			window.ipcRenderer.send("mongodb-find-query", {
				collection: "users",
				schemaString: "UserSchema",
				query: {
					/* your filter criteria */
					// username: "irfan",
				},
				projection: {
					// id: 1,
					// username: 1,
					// first_name: 1,
				},
			});
			window.ipcRenderer.once(
				"mongodb-find-query-response",
				(_, response) => {
					// console.log(response);
					const documents = response.results.map((result: any) => {
						return {
							id: result.id,
							...result._doc,
						};
					}); // Extract document data
					resolve(documents); // Resolve the promise with document data
				}
			);
		});

		if (response.error) {
			console.error("Error fetching users:", response.error);
			return response.error;
			// Handle the error (e.g., display an error message to the user)
		} else {
			return response; // Return the fetched users
		}
	},
	userLogin: async (
		username: string,
		password: string
	): Promise<LoginResponse> => {
		try {
			const user = await new Promise<any>((resolve) => {
				window.ipcRenderer.send("mongodb-find-query", {
					collection: "users",
					schemaString: "UserSchema",
					query: {
						/* your filter criteria */
						username: username,
					},
					projection: {
						// _id: 0,
						// first_name: 1,
					},
				});
				window.ipcRenderer.once(
					"mongodb-find-query-response",
					(_, response) => {
						const documents = response.results.map(
							(result: any) => result._doc
						); // Extract document data
						resolve(documents); // Resolve the promise with document data
					}
				);
			});

			if (user.length === 0) {
				return { error: "Invalid username" };
			}

			// console.log(password, user);

			const response = await new Promise<LoginResponse>((resolve) => {
				window.ipcRenderer.send(
					"validatePassword",
					password,
					user[0].password
				);
				window.ipcRenderer.once(
					"validatePasswordResponse",
					(_, response) => {
						resolve(response);
					}
				);
			});

			if (response.success) {
				return {
					success: true,
					user: {
						username: user[0].username,
						first_name: user[0].first_name,
						last_name: user[0].last_name,
						user_role: user[0].user_role,
					},
				};
			} else {
				return {
					success: false,
					error: response.error || "Invalid password",
				};
			}
		} catch (err) {
			console.error("Login Error:", err);
			return { success: false, error: "Internal Server Error" };
		}
	},
	addUser: async (user: User): Promise<any> => {
		try {
			await new Promise<string>((resolve) => {
				window.ipcRenderer.send("hashPassword", user.password);
				window.ipcRenderer.once(
					"hashedPasswordGenerated",
					async (_, hashedPassword) => {
						window.ipcRenderer.send("mongodb-create-query", {
							collection: "users",
							schemaString: "UserSchema",
							document: {
								/* your filter criteria */
								// username: username,
								username: user.username,
								password: hashedPassword,
								first_name: user.first_name,
								last_name: user.last_name,
								user_role: user.user_role,
							},
						});
						window.ipcRenderer.once(
							"mongodb-create-query-response",
							(_, response) => {
								console.log("User added:", response);
								resolve(response);
							}
						);
					}
				);
			});

			return true;
		} catch (err: any) {
			console.error("Error adding user:", err);
			return false;
		}
	},
	editUser: async (user: User): Promise<any> => {
		// console.log("User:", user);
		try {
			await new Promise<string>((resolve) => {
				window.ipcRenderer.send("mongodb-update-query", {
					collection: "users",
					schemaString: "UserSchema",
					document: {
						/* your filter criteria */
						// username: username,
						id: user.id,
						username: user.username,
						first_name: user.first_name,
						last_name: user.last_name,
						user_role: user.user_role,
					},
				});
				window.ipcRenderer.once(
					"mongodb-update-query-response",
					(_, response) => {
						console.log("User Edited:", response);
						resolve(response);
					}
				);
			});

			if (user.password !== "" && user.password !== undefined) {
				await new Promise<string>((resolve) => {
					window.ipcRenderer.send("hashPassword", user.password);
					window.ipcRenderer.once(
						"hashedPasswordGenerated",
						async (_, hashedPassword) => {
							window.ipcRenderer.send("mongodb-update-query", {
								collection: "users",
								schemaString: "UserSchema",
								document: {
									id: user.id,
									password: hashedPassword,
								},
							});
							window.ipcRenderer.once(
								"mongodb-update-query-response",
								(_, response) => {
									// console.log(
									// 	"Password Updated:",
									// 	hashedPassword
									// );
									resolve(response);
								}
							);
						}
					);
				});
			}
			return true;
		} catch (err: any) {
			console.error("Error adding user:", err);
			return false;
		}
	},
	deleteUser: async (user: User): Promise<any> => {
		// console.log("User:", user);
		try {
			await new Promise<string>((resolve) => {
				window.ipcRenderer.send("mongodb-delete-query", {
					collection: "users",
					schemaString: "UserSchema",
					document: {
						id: user.id,
					},
				});
				window.ipcRenderer.once(
					"mongodb-delete-query-response",
					(_, response) => {
						console.log("User deleted:", response);
						resolve(response);
					}
				);
			});
			return true;
		} catch (err: any) {
			console.error("Error deleting user:", err);
			return false;
		}
	},
};
