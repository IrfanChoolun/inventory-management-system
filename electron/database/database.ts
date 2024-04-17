import { app, ipcMain } from "electron";
import mongoose from "mongoose";
import { c } from "vite/dist/node/types.d-aGj9QkWt";

export const database = () => {
	const userSchema = new mongoose.Schema({
		username: { type: String, required: true },
		password: { type: String, required: true },
		first_name: { type: String, required: true },
		last_name: { type: String, required: true },
		user_role: { type: String, required: true },
	});

	const productSchema = new mongoose.Schema({
		sku: { type: String, required: true },
		name: { type: String, required: true },
		description: { type: String, required: true },
		category_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		brand: { type: String, required: true },
	});

	const productVariationSchema = new mongoose.Schema({
		parent_product_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		sku: { type: String, required: true },
		name: { type: String, required: true },
		price: { type: Number, required: true },
		stock_per_location: { type: Array<stock_per_location>, required: true },
		min_stock: { type: Number, required: true },
		// location: { type: String, required: true },
		status: { type: Boolean, required: true },
		variations: { type: Object, required: true },
	});

	const LocationSchema = new mongoose.Schema({
		name: { type: String, required: true },
		address: { type: String, required: true },
		contact_info: { type: String, required: true },
	});

	const CategorySchema = new mongoose.Schema({
		name: { type: String, required: true },
		address: { type: String, required: true },
		properties: { type: Array, required: true },
	});

	type stock_per_location = {
		location: string;
		stock: number;
	};

	// Database setup
	const uri = "mongodb://localhost:27017/aioims";

	mongoose
		.connect(uri)
		.then(() => console.log("Connected to MongoDB successfully!"))
		.catch((error) => {
			console.error("Error connecting to MongoDB:", error);
			app.quit();
		});

	console.log("Database connected successfully");

	// find query
	ipcMain.on(
		"mongodb-find-query",
		async (
			event,
			queryObject: {
				collection: string;
				schemaString: string;
				query: any;
				projection?: any;
			}
		) => {
			try {
				const { collection, schemaString, query, projection } =
					queryObject;

				// handle Schema Selection
				const schema = selectSchema(schemaString);

				const model: mongoose.Model<any> = mongoose.model(
					collection,
					schema
				);

				const rawResults = await model.find(query, projection);

				// loop through results, and return a new array of objects, but convert the _id to a string
				// console.log("collection:", collection);
				// console.log("schemaString:", schemaString);
				// console.log("schema:", schema);
				// console.log("query:", query);
				// console.log("projection:", projection);
				// console.log(rawResults);

				const results = await rawResults.map((result: any) => {
					return {
						id: result._id.toString(),
						...result,
					};
				});

				event.sender.send("mongodb-find-query-response", {
					results,
				});
			} catch (error: any) {
				console.error("Error running MongoDB query:", error);
				event.sender.send("mongodb-find-query-response", {
					error,
				});
			}
		}
	);

	// findProducts query
	ipcMain.on(
		"mongodb-findProducts-query",
		async (
			event,
			queryObject: {
				collection: string;
				schemaString: string;
				query: any;
				projection?: any;
			}
		) => {
			try {
				const { collection, schemaString, query, projection } =
					queryObject;

				// handle Schema Selection
				const schema = selectSchema(schemaString);

				const model: mongoose.Model<any> = mongoose.model(
					collection,
					schema
				);

				query._id = { $in: query._id.map((id: string) => id) };

				const rawResults = await model.find(query, projection);

				// loop through results, and return a new array of objects, but convert the _id to a string
				// console.log("collection:", collection);
				// console.log("schemaString:", schemaString);
				// console.log("schema:", schema);
				console.log("query:", query);
				// console.log("projection:", projection);
				// console.log(rawResults);

				const results = await rawResults.map((result: any) => {
					return {
						id: result._id.toString(),
						sku: result.sku,
						name: result.name,
						description: result.description,
						category_id: result.category_id.toString(),
						brand: result.brand,
					};
				});

				event.sender.send("mongodb-findProducts-query-response", {
					results,
				});
			} catch (error: any) {
				console.error("Error running MongoDB query:", error);
				event.sender.send("mongodb-findProducts-query-response", {
					error,
				});
			}
		}
	);

	// getVariationParents query
	// ipcMain.on(
	// 	"mongodb-getVariationParents-query",
	// 	async (
	// 		event,
	// 		queryObject: {
	// 			collection: string;
	// 			schemaString: string;
	// 			query: any;
	// 			projection?: any;
	// 		}
	// 	) => {
	// 		try {
	// 			const { collection, schemaString, query, projection } =
	// 				queryObject;

	// 			// handle Schema Selection
	// 			const schema = selectSchema(schemaString);

	// 			const model: mongoose.Model<any> = mongoose.model(
	// 				collection,
	// 				schema
	// 			);

	// 			query._id = { $in: query._id.map((id: string) => id) };

	// 			const rawResults = await model.find(query, projection);

	// 			// loop through results, and return a new array of objects, but convert the _id to a string
	// 			// console.log("collection:", collection);
	// 			// console.log("schemaString:", schemaString);
	// 			// console.log("schema:", schema);
	// 			// console.log("query:", query);
	// 			// console.log("projection:", projection);
	// 			console.log(rawResults);

	// 			const results = await rawResults.map((result: any) => {
	// 				return {
	// 					id: result._id.toString(),
	// 					...result,
	// 				};
	// 			});

	// 			event.sender.send(
	// 				"mongodb-getVariationParents-query-response",
	// 				{
	// 					results,
	// 				}
	// 			);
	// 		} catch (error: any) {
	// 			console.error("Error running MongoDB query:", error);
	// 			event.sender.send(
	// 				"mongodb-getVariationParents-query-response",
	// 				{
	// 					error,
	// 				}
	// 			);
	// 		}
	// 	}
	// );

	// getProductVariants query
	ipcMain.on(
		"mongodb-getProductVariants-query",
		async (
			event,
			queryObject: {
				collection: string;
				schemaString: string;
				query: any;
				projection?: any;
			}
		) => {
			try {
				const { collection, schemaString, query, projection } =
					queryObject;

				// handle Schema Selection
				const schema = selectSchema(schemaString);

				const variantModel: mongoose.Model<any> = mongoose.model(
					collection,
					schema
				);

				const productModel: mongoose.Model<any> = mongoose.model(
					"products",
					productSchema
				);

				let rawResults;

				// console.log("query:", query);

				if (query.name !== "" && query.name !== undefined) {
					const filter = {
						$or: [
							{ name: { $regex: new RegExp(query.name, "i") } },
							{ sku: { $regex: new RegExp(query.name, "i") } },
						],
					};
					rawResults = await variantModel.find(filter, projection);

					if (rawResults.length === 0) {
						const altFilter = {
							$or: [
								{
									name: {
										$regex: new RegExp(query.name, "i"),
									},
								},
								{
									description: {
										$regex: new RegExp(query.name, "i"),
									},
								},
								{
									brand: {
										$regex: new RegExp(query.name, "i"),
									},
								},
							],
						};
						let parent_prod_result: string[] = await productModel
							.find(altFilter, { _id: 1 })
							.then((products) =>
								products.map((product) => product._id)
							);

						console.log("parent_prod_result", parent_prod_result);

						if (parent_prod_result.length != 0) {
							query.parent_product_id = {
								$in: parent_prod_result,
							};

							delete query.name;

							rawResults = await variantModel.find(
								query,
								projection
							);
						}
					}
				} else {
					// query all
					delete query.name;
					rawResults = await variantModel.find(query, projection);
				}

				// const rawResults = await variantModel.find(query, projection);
				console.log("variantquery", query);
				console.log("variantraw", rawResults);
				const results = await rawResults.map((result: any) => {
					// console.log(result);
					// price: 4.5,
					// min_stock: 15,
					// location: [ new ObjectId('6616c400e830a6258e4e09ac') ],
					// status: true,
					// name: 'Phillips Stainless Steel Head Screw (M6, Fine)',
					// sku: 'PSSM620',
					// variations: {
					//   Length: '20mm',
					//   Material: 'Stainless Steel',
					//   Size: 'M6',
					//   'Thread Type': 'Fine'
					// },
					// console.log("variations:", {
					// 	id: result._id.toString(),
					// 	parent_product_id: result.parent_product_id.toString(),
					// 	stock_per_locations: result.stock_per_location.map(
					// 		(item: any) => {
					// 			return {
					// 				location: item.location.toString(),
					// 				stock: item.stock,
					// 			};
					// 		}
					// 	),
					// 	price: result.price,
					// 	min_stock: result.min_stock,
					// 	status: result.status,
					// 	name: result.name,
					// 	sku: result.sku,
					// 	variations: result.variations,
					// });

					return {
						id: result._id.toString(),
						parent_product_id: result.parent_product_id.toString(),
						stock_per_location: result.stock_per_location.map(
							(item: any) => {
								return {
									location: item.location.toString(),
									stock: item.stock,
								};
							}
						),
						price: result.price,
						min_stock: result.min_stock,
						status: result.status,
						name: result.name,
						sku: result.sku,
						variations: result.variations,
					};
				});

				event.sender.send("mongodb-getProductVariants-query-response", {
					results,
				});
			} catch (error: any) {
				console.error("Error running MongoDB query:", error);
				event.sender.send("mongodb-getProductVariants-query-response", {
					error,
				});
			}
		}
	);

	// getProductLocations query
	ipcMain.on(
		"mongodb-getProductLocations-query",
		async (
			event,
			queryObject: {
				collection: string;
				schemaString: string;
				query: any;
				projection?: any;
			}
		) => {
			try {
				const { collection, schemaString, query, projection } =
					queryObject;

				// handle Schema Selection
				const schema = selectSchema(schemaString);

				const model: mongoose.Model<any> = mongoose.model(
					collection,
					schema
				);

				const rawResults = await model.find(query, projection);

				// console.log("raw", rawResults);
				const results = await rawResults.map((result: any) => {
					// console.log(result);
					return {
						id: result._id.toString(),
						name: result.name,
						address: result.address,
						contact_info: result.contact_info,
					};
				});

				event.sender.send(
					"mongodb-getProductLocations-query-response",
					{
						results,
					}
				);
			} catch (error: any) {
				console.error("Error running MongoDB query:", error);
				event.sender.send(
					"mongodb-getProductLocations-query-response",
					{
						error,
					}
				);
			}
		}
	);

	// getProductCategories query
	ipcMain.on(
		"mongodb-getProductCategories-query",
		async (
			event,
			queryObject: {
				collection: string;
				schemaString: string;
				query: any;
				projection?: any;
			}
		) => {
			try {
				const { collection, schemaString, query, projection } =
					queryObject;

				// handle Schema Selection
				const schema = selectSchema(schemaString);

				const model: mongoose.Model<any> = mongoose.model(
					collection,
					schema
				);

				const rawResults = await model.find(query, projection);

				console.log("raw", rawResults);
				const results = await rawResults.map((result: any) => {
					// console.log(result);
					return {
						id: result._id.toString(),
						name: result.name,
						properties: [...result.properties],
					};
				});

				event.sender.send(
					"mongodb-getProductCategories-query-response",
					{
						results,
					}
				);
			} catch (error: any) {
				console.error("Error running MongoDB query:", error);
				event.sender.send(
					"mongodb-getProductCategories-query-response",
					{
						error,
					}
				);
			}
		}
	);

	// create query
	ipcMain.on(
		"mongodb-create-query",
		async (
			event,
			queryObject: {
				collection: string;
				schemaString: string;
				document: any;
				projection?: any;
			}
		) => {
			try {
				const { collection, schemaString, document } = queryObject;

				// handle Schema Selection
				const schema = await selectSchema(schemaString);

				const model = await mongoose.model(collection, schema);

				await model.create(document);

				await event.sender.send("mongodb-create-query-response", true);
			} catch (error: any) {
				console.error("Error running MongoDB query:", error);
				event.sender.send("mongodb-create-query-response", {
					error,
				});
			}
		}
	);

	// update query
	ipcMain.on(
		"mongodb-update-query",
		async (
			event,
			queryObject: {
				collection: string;
				schemaString: string;
				document: any;
				projection?: any;
			}
		) => {
			try {
				const { collection, schemaString, document } = queryObject;

				// handle Schema Selection
				const schema = await selectSchema(schemaString);

				const model = await mongoose.model(collection, schema);

				await model.findOneAndUpdate(
					{ _id: document.id },
					document,
					{}
				);

				await event.sender.send("mongodb-update-query-response", true);
			} catch (error: any) {
				console.error("Error running MongoDB query:", error);
				event.sender.send("mongodb-update-query-response", {
					error,
				});
			}
		}
	);

	// delete query
	ipcMain.on(
		"mongodb-delete-query",
		async (
			event,
			queryObject: {
				collection: string;
				schemaString: string;
				document: any;
				projection?: any;
			}
		) => {
			try {
				const { collection, schemaString, document } = queryObject;

				// handle Schema Selection
				const schema = await selectSchema(schemaString);

				const model = await mongoose.model(collection, schema);

				await model.findByIdAndDelete({ _id: document.id });

				await event.sender.send("mongodb-delete-query-response", true);
			} catch (error: any) {
				console.error("Error running MongoDB query:", error);
				event.sender.send("mongodb-delete-query-response", {
					error,
				});
			}
		}
	);

	function selectSchema(schemaString: string) {
		// Implement logic to select schema based on string (e.g., userSchema, productSchema)
		// You can use a switch statement or a mapping object for different schema names
		if (schemaString === "UserSchema") {
			return userSchema;
		} else if (schemaString === "ProductSchema") {
			// Implement Product Schema
			return productSchema;
		} else if (schemaString === "ProductVariationSchema") {
			// Implement Product Variation Schema
			return productVariationSchema;
		} else if (schemaString === "LocationSchema") {
			// Implement Location Schema
			return LocationSchema;
		} else if (schemaString === "CategorySchema") {
			// Implement CategorySchema
			return CategorySchema;
		} else {
			throw new Error(`Unsupported schema: ${schemaString}`);
		}
	}
};
