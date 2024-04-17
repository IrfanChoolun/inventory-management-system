// import { MongoDb } from "@/utils/services/MongoDbUtils";

import { a } from "vite/dist/node/types.d-aGj9QkWt";

export type Product = {
	id?: string;
	sku?: string;
	name?: string;
	description?: string;
	category_id?: string;
	brand?: string;
};

export type ProductVariation = {
	id?: any;
	sku: string;
	name: string;
	parent_product_id: string;
	price: number;
	stock_per_location: Array<stock_per_location>;
	status: boolean;
	min_stock: number;
	// location: Array<LocationArray>;
	variations: any;
};

export type Location = {
	id: any;
	name: string;
	address: string;
	contact_info: string;
};

export type Category = {
	id: any;
	name: string;
	properties: Array<any>;
};

export type stock_per_location = {
	location: string;
	stock: number;
};

// export type LocationArray = {

// };

// export type Location = {
// 	id?: number;
// 	name?: string;
// 	address?: string;
// 	contact_info?: string;
// 	type?: string;
// };

export const ProductService = {
	getProducts: async (id_array: string[]): Promise<Product[]> => {
		const response = await new Promise<any>((resolve) => {
			window.ipcRenderer.send("mongodb-findProducts-query", {
				collection: "products",
				schemaString: "ProductSchema",
				query: {
					/* your filter criteria */
					_id: id_array,
				},
				projection: {
					// id: 1,
					// username: 1,
					// first_name: 1,
				},
			});
			window.ipcRenderer.once(
				"mongodb-findProducts-query-response",
				(_, response) => {
					// console.log("TEST:", response);
					const documents = response.results.map((result: any) => {
						return {
							...result,
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
	getVariations: async (query: string): Promise<ProductVariation[]> => {
		const response = await new Promise<any>((resolve) => {
			window.ipcRenderer.send("mongodb-getProductVariants-query", {
				collection: "product_variants",
				schemaString: "ProductVariationSchema",
				query: {
					/* your filter criteria */
					name: query,
				},
				projection: {
					// id: 1,
					// username: 1,
					// first_name: 1,
					// stock: 1,
				},
			});
			window.ipcRenderer.once(
				"mongodb-getProductVariants-query-response",
				(_, response) => {
					// console.log("variations:", response);
					const documents = response.results.map((result: any) => {
						return {
							...result,
						};
					}); // Extract document data
					resolve(documents); // Resolve the promise with document data
				}
			);
		});

		if (response.error) {
			console.error("Error fetching variations:", response.error);
			return response.error;
			// Handle the error (e.g., display an error message to the user)
		} else {
			return response; // Return the fetched users
		}
	},
	getLocations: async (): Promise<Location[]> => {
		const response = await new Promise<any>((resolve) => {
			window.ipcRenderer.send("mongodb-getProductLocations-query", {
				collection: "locations",
				schemaString: "LocationSchema",
				query: {
					/* your filter criteria */
					// username: "irfan",
				},
				projection: {
					// id: 1,
					// username: 1,
					// first_name: 1,
					// stock: 1,
				},
			});
			window.ipcRenderer.once(
				"mongodb-getProductLocations-query-response",
				(_, response) => {
					// console.log("locations:", response);
					const documents = response.results.map((result: any) => {
						return {
							...result,
						};
					}); // Extract document data
					resolve(documents); // Resolve the promise with document data
				}
			);
		});

		if (response.error) {
			console.error("Error fetching locations:", response.error);
			return response.error;
			// Handle the error (e.g., display an error message to the user)
		} else {
			return response; // Return the fetched users
		}
	},
	getCategories: async (): Promise<Category[]> => {
		const response = await new Promise<any>((resolve) => {
			window.ipcRenderer.send("mongodb-getProductCategories-query", {
				collection: "categories",
				schemaString: "CategorySchema",
				query: {
					/* your filter criteria */
					// username: "irfan",
				},
				projection: {
					// id: 1,
					// username: 1,
					// first_name: 1,
					// stock: 1,
				},
			});
			window.ipcRenderer.once(
				"mongodb-getProductCategories-query-response",
				(_, response) => {
					// console.log("Categories:", response);
					const documents = response.results.map((result: any) => {
						return {
							...result,
						};
					}); // Extract document data
					resolve(documents); // Resolve the promise with document data
				}
			);
		});

		if (response.error) {
			console.error("Error fetching Categories:", response.error);
			return response.error;
			// Handle the error (e.g., display an error message to the user)
		} else {
			return response; // Return the fetched users
		}
	},
	// getVariationById: async (id: number): Promise<ProductVariation[]> => {
	// 	const res = await MongoDb.runQuery<ProductVariation[]>(
	// 		`SELECT * FROM variations WHERE item_id = ${id}`
	// 	);
	// 	return res;
	// },
	// getLocations: async (): Promise<Location[]> => {
	// 	const res = await MongoDb.runQuery<Location[]>(
	// 		`SELECT * FROM locations`
	// 	);
	// 	return res;
	// },
};
