import CommonLayout from "../../components/CommonLayout";
import ViewDetailsOverviewTab from "../../components/ViewDetailsOverviewTab";
import { UserService, User } from "@/utils/UserService";
import {
	ProductService,
	Product,
	ProductVariation,
	Location,
	Category,
} from "@/utils/ProductService";
import { useState, useEffect } from "react";
import "./ManageProducts.scss";
import type { TableColumnsType, TableProps, TabsProps } from "antd";
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	Select,
	Popconfirm,
	Badge,
	Drawer,
	Dropdown,
	Space,
	Tabs,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { set } from "mongoose";
import { c } from "vite/dist/node/types.d-aGj9QkWt";
import { AnyARecord } from "dns";

type OnChange = NonNullable<TableProps<DataType>["onChange"]>;

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface DataType {
	key: string;
	name: JSX.Element;
	description: JSX.Element;
	brand: JSX.Element;
	category: JSX.Element;
	// status: JSX.Element;
}

interface ExpandedDataType {
	id?: string;
	key: string;
	sku: string;
	name: string;
	parent_product_id: string;
	price: number;
	stock: number;
	status: JSX.Element;
	min_stock: number;
	// location: string;
	// variations: object;
}

function ManageProducts({
	expandedItems,
	setExpandedItems,
	globalUser,
	setGlobalUser,
}: {
	expandedItems: any;
	setExpandedItems: any;
	globalUser: any;
	setGlobalUser: any;
}) {
	const [products, setProducts] = useState<Product[]>([]);
	const [productVariations, setProductVariations] = useState<
		ProductVariation[]
	>([]);
	const [productVariation, setProductVariation] = useState<
		ProductVariation[]
	>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [locations, setLocations] = useState<Location[]>([]);
	const [category, setCategory] = useState("");

	const [sortedInfo, setSortedInfo] = useState<Sorts>({});
	const [addUserModalVisible, setAddUserModalVisible] = useState(false);
	const [editUserModalVisible, setEditUserModalVisible] = useState(false);
	const [viewDetailsModalVisible, setViewDetailsModalVisible] =
		useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
	const [isSearchActive, setIsSearchActive] = useState(false);
	const [searchValue, setSearchValue] = useState("");

	useEffect(() => {
		// get an array of parent_product_id
		fetchVariations();
		// const parent_prod_ids = productVariations.map((product) => {
		// 	return product.parent_product_id;
		// });

		// fetchProducts(parent_prod_ids);
		fetchLocations();
		fetchCategories();
		// setIsSearchActive(false);
	}, []);

	useEffect(() => {
		// if (isSearchActive) {
		// fetchProducts(searchValue);
		// fetchProducts();
		fetchVariations(searchValue);
		// }
	}, [searchValue]);

	async function fetchProducts(id_array: string[]) {
		const products = await ProductService.getProducts(id_array);
		setProducts(products);
	}

	async function fetchVariations(query: string = "") {
		const productVar = await ProductService.getVariations(query);
		console.log("productVar:", productVar);
		const parent_prod_ids = await productVar.map((product) => {
			return product.parent_product_id;
		});
		console.log("parent_prod_ids:", parent_prod_ids);
		setProductVariations(productVar);
		fetchProducts(parent_prod_ids);
	}

	async function fetchCategories() {
		const categories = await ProductService.getCategories();
		setCategories(categories);
	}

	async function fetchLocations() {
		const locations = await ProductService.getLocations();
		setLocations(locations);
	}

	console.log("products:", products);
	console.log("productsVariations:", productVariations);

	// const handleChange: OnChange = (pagination, filters, sorter) => {
	//   console.log("Various parameters", pagination, filters, sorter);
	//   setSortedInfo(sorter as Sorts);
	// };

	const [addUserForm] = Form.useForm();
	const [editUserForm] = Form.useForm();
	const [viewDetailsForm] = Form.useForm();

	const handleOk = async (modalType: string) => {
		if (modalType === "adduser") {
			try {
				await addUserForm.validateFields();
				// add user to database
				const values = addUserForm.getFieldsValue();
				console.log("Received values of form: ", values); // { username: "username", password: "password", first_name: "first_name", last_name: "last_name", user_role: "user" }
				const res = await UserService.addUser(values);
				if (res) {
					await fetchVariations();
					console.log(res);
					addUserForm.resetFields();
					setAddUserModalVisible(false);
					setConfirmLoading(false);
				} else {
					console.log("Failed to add user");
					setConfirmLoading(false);
				}
			} catch (errors) {
				setConfirmLoading(false);
				// console.error("Form validation errors:", errors);
			}
		} else if (modalType === "edituser") {
			try {
				await editUserForm.validateFields();
				const values = editUserForm.getFieldsValue();
				const res = await UserService.editUser(values);
				if (res) {
					await fetchVariations();
					console.log(res);
					editUserForm.resetFields();
					setEditUserModalVisible(false);
					setConfirmLoading(false);
				} else {
					console.log("Failed to edit user");
					setConfirmLoading(false);
				}
			} catch (errors) {
				setConfirmLoading(false);
				// console.error("Form validation errors:", errors);
			}
		}
	};

	const handleCancel = (modalType: string) => {
		if (modalType === "adduser") {
			setAddUserModalVisible(false);
		} else if (modalType === "edituser") {
			setEditUserModalVisible(false);
		}
	};

	const closeDrawer = () => {
		setViewDetailsOpen(false);
	};

	const handleEdit = (id: string) => {
		// const user = users.find((user) => user.id === id);
		// if (user) {
		//   editUserForm.setFieldsValue({
		//     id: user.id,
		//     username: user.username,
		//     first_name: user.first_name,
		//     last_name: user.last_name,
		//     user_role: user.user_role,
		//   });
		//   setEditUserModalVisible(true);
		// }
	};

	const handleDelete = async (id: string) => {
		// const user = users.find((user) => user.id === id);
		// if (user) {
		//   await UserService.deleteUser(user);
		//   await fetchProducts();
		// }
	};

	const handleViewDetails = async (id: string) => {
		// console.log(id);
		const productDetails = productVariations
			.filter((product) => product.id === id)
			.map((product) => {
				return {
					key: product.id,
					sku: product.sku,
					name: product.name,
					price: product.price,
					stock_per_location: product.stock_per_location,
					min_stock: product.min_stock,
					status: product.status,
					variations: product.variations,
					parent_product_id: product.parent_product_id,
				};
			});

		let productCatId: any;
		products.map((prod) => {
			if (prod.id === productDetails[0].parent_product_id) {
				productCatId = prod.category_id;
			}
		});

		let category = "";
		categories.map((cat) => {
			if (cat.id === productCatId) {
				category = cat.name;
			}
		});

		setCategory(category);
		setProductVariation(productDetails);
		console.log(productVariation);
		setViewDetailsOpen(true);
		// viewDetailsForm.setFieldsValue({

		// });
		// setViewDetailsModalVisible(true);
	};

	const onExpand = (event: any) => {
		console.log(event);
		// get the grandparent div .parent-row, then find .ant-table-row-expand-icon-cell button and click it
		event.target
			.closest(".parent-row")
			.querySelector(".ant-table-row-expand-icon-cell button")
			.click();
	};

	const expandedRowRender = (id: string) => {
		let data: ExpandedDataType[] = [];

		data = productVariations
			.filter((product) => {
				console.log(product, id);
				return product.parent_product_id === id;
			})
			.map((product) => {
				console.log(product.stock_per_location);
				let statusBadge;
				if (product.status) {
					statusBadge = <Badge status="success" text="In Stock" />;
				} else {
					statusBadge = <Badge status="error" text="Out of Stock" />;
				}

				let stock = 0;
				product.stock_per_location.forEach((item: any) => {
					stock += item.stock;
				});

				let location;
				// console.log("locations:", locations);
				if (product.stock_per_location.length > 1) {
					location = "Multiple locations";
				} else {
					locations.forEach((loc) => {
						if (loc.id === product.stock_per_location[0].location) {
							location = loc.name;
						}
					});
					// location = product.stock_per_location[0].location;
				}

				return {
					key: product.id,
					sku: product.sku,
					name: product.name,
					price: product.price,
					stock_per_location: product.stock_per_location,
					min_stock: product.min_stock,
					location: location,
					stock: stock,
					status: statusBadge,
					// variations: product.variations || {},
					parent_product_id: product.parent_product_id,
				};
			});

		const columns: TableColumnsType<ExpandedDataType> = [
			{
				title: "ID",
				dataIndex: "key",
				key: "key",
				hidden: true,
			},
			{
				title: "SKU",
				dataIndex: "sku",
				key: "sku",
			},
			{
				title: "Name",
				dataIndex: "name",
				key: "name",
			},
			{
				title: "Price",
				dataIndex: "price",
				key: "price",
			},
			{
				title: "Stock",
				dataIndex: "stock",
				key: "stock",
			},
			{
				title: "Min Stock",
				dataIndex: "min_stock",
				key: "min_stock",
			},
			{
				title: "Location",
				dataIndex: "location",
				key: "location",
			},
			{
				title: "Status",
				dataIndex: "status",
				key: "status",
			},
			{
				title: "",
				key: "viewDetails",
				render: (_, record) => (
					<>
						<a onClick={() => handleViewDetails(record.key)}>
							View Details
						</a>
					</>
				),
			},
			{
				title: "Action",
				key: "action",
				render: (_, record) => (
					<>
						<a onClick={() => handleEdit(record.key)}>Edit</a>
						<span> | </span>
						<Popconfirm
							title="Are you sure you want to delete this product?"
							onConfirm={async () => {
								await handleDelete(record.key);
							}}
						>
							<a>Delete</a>
						</Popconfirm>
					</>
				),
			},
		];

		return <Table columns={columns} dataSource={data} pagination={false} />;
	};

	// const isRowExpandable = (id: number) => {
	// 	const filteredVariations = productVariations.filter(
	// 		(variation) => variation.item_id === id
	// 	);

	// 	if (filteredVariations.length === 0) {
	// 		return false;
	// 	} else {
	// 		return true;
	// 	}
	// };

	const data: DataType[] = products.map((product) => {
		// let stock_level = 0;
		// let locations, status;

		// if (product.status === 1) {
		// 	status = <Badge status="success" text="In Stock" />;
		// } else {
		// 	status = <Badge status="error" text="Out of Stock" />;
		// }

		// Filter variations for the product
		// const productVariationsForThisProduct = productVariations.filter(
		// 	(variation) => variation.item_id === product.id
		// );

		// // Check if there are any variations
		// if (productVariationsForThisProduct.length > 0) {
		// 	// If variations exist, sum their stock levels
		// 	stock_level = productVariationsForThisProduct.reduce(
		// 		(acc, variation) => acc + variation.stock_level,
		// 		0 // Initial accumulator value
		// 	);
		// 	locations = "Multiple locations";
		// } else {
		// 	// If no variations exist, use product stock level (or 0 if undefined)
		// 	stock_level = product.stock_level || 0;
		// 	locations = product.location || "";
		// }
		// let category: JSX.Element;
		// console.log("categories:", categories);

		let name = (
			<div onClick={(event) => onExpand(event)}>{product.name}</div>
		);

		let description = (
			<div onClick={(event) => onExpand(event)}>
				{product.description}
			</div>
		);

		let brand = (
			<div onClick={(event) => onExpand(event)}>{product.brand}</div>
		);

		let category: JSX.Element = <></>; // Assign a default value to category

		categories.map((cat) => {
			console.log(cat.id, product.category_id);
			if (cat.id === product.category_id) {
				category = (
					<div onClick={(event) => onExpand(event)}>{cat.name}</div>
				);
			}
		});

		return {
			key: product.id || "",
			name: name,
			description: description,
			brand: brand,
			category: category,
		};
	});

	const columns: TableColumnsType<DataType> = [
		{
			title: "ID",
			dataIndex: "key",
			key: "key",
			hidden: true,
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "Brand",
			dataIndex: "brand",
			key: "brand",
		},
		{
			title: "Category",
			dataIndex: "category",
			key: "category",
		},
		{
			title: "Action",
			key: "action",
			render: (_, record) => (
				<>
					<a onClick={() => handleEdit(record.key)}>Edit</a>
					<span> | </span>
					<Popconfirm
						title="Are you sure you want to delete this product?"
						onConfirm={async () => {
							await handleDelete(record.key);
						}}
					>
						<a>Delete</a>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<CommonLayout
			pageName="manageProducts"
			expandedItems={expandedItems}
			setExpandedItems={setExpandedItems}
			globalUser={globalUser}
			setGlobalUser={setGlobalUser}
		>
			<div>
				<div className="top_section">
					<h5>All Products</h5>
					<Button
						type="primary"
						onClick={() => setAddUserModalVisible(true)}
					>
						Add a Product
					</Button>
				</div>
				<div className="search_container">
					<h6>Search for a product</h6>
					<Input
						placeholder="Search for a product"
						onChange={(e) => {
							const searchValue = e.target.value;
							console.log(searchValue);
							if (
								searchValue === "" ||
								searchValue === undefined
							) {
								setIsSearchActive(false);
								setSearchValue(searchValue);
							} else {
								setIsSearchActive(true);
								setSearchValue(searchValue);
							}
						}}
					/>
				</div>
				{/* {!isSearchActive ? ( */}
				<Table
					columns={columns}
					rowKey={(record) => record.key}
					expandable={{
						expandedRowRender: (record) =>
							expandedRowRender(record.key),
						defaultExpandedRowKeys: ["0"],
						// rowExpandable: (record) => isRowExpandable(record.key),
						// expandRowByClick: true,
						// onExpand={(record, event) => {
						// 	console.log(record, record);
						// },
						// }},
					}}
					rowClassName="parent-row"
					dataSource={data}
					// onChange={handleChange}
				/>
				{/* ) : ( */}
				{/* <></> */}
				{/* )} */}
				{/* Add User Modal */}
				<Modal
					title="Add User"
					open={addUserModalVisible}
					centered
					onOk={() => handleOk("adduser")}
					confirmLoading={confirmLoading}
					onCancel={() => handleCancel("adduser")}
				>
					<Form
						layout="vertical"
						form={addUserForm}
						initialValues={{
							layout: "vertical",
							user_role: "user",
						}}
						style={{ maxWidth: 600 }}
					>
						<Form.Item
							name="username"
							label="Username"
							rules={[
								{
									required: true,
									message: "Username is required",
								},
							]}
						>
							<Input placeholder="Enter Username" />
						</Form.Item>
						<Form.Item
							name="password"
							label="Password"
							rules={[
								{
									required: true,
									message: "Password is required",
								},
							]}
						>
							<Input placeholder="Enter Password" />
						</Form.Item>
						<Form.Item
							name="first_name"
							label="First Name"
							rules={[
								{
									required: true,
									message: "First Name is required",
								},
							]}
						>
							<Input placeholder="Enter First Name" />
						</Form.Item>
						<Form.Item
							name="last_name"
							label="Last Name"
							rules={[
								{
									required: true,
									message: "Last Name is required",
								},
							]}
						>
							<Input placeholder="Enter Last Name" />
						</Form.Item>
						<Form.Item
							name="user_role"
							label="User Role"
							rules={[
								{
									required: true,
									message: "User Role is required",
								},
							]}
						>
							<Select
								options={[
									{ value: "user", label: "User" },
									{ value: "manager", label: "Manager" },
									{
										value: "super_administrator",
										label: "Super Administrator",
									},
								]}
							/>
						</Form.Item>
					</Form>
				</Modal>
				{/* Edit User Modal */}
				<Modal
					title="Edit User"
					open={editUserModalVisible}
					centered
					onOk={() => handleOk("edituser")}
					confirmLoading={confirmLoading}
					onCancel={() => handleCancel("edituser")}
				>
					<Form
						layout="vertical"
						form={editUserForm}
						initialValues={{
							layout: "vertical",
							user_role: "user",
						}}
						style={{ maxWidth: 600 }}
					>
						<Form.Item name="id" label="ID" hidden={true}>
							<Input />
						</Form.Item>
						<Form.Item
							name="username"
							label="Username"
							rules={[
								{
									required: true,
									message: "Username is required",
								},
							]}
						>
							<Input placeholder="Enter Username" />
						</Form.Item>
						<Form.Item name="password" label="Password">
							<Input placeholder="Enter Password" />
						</Form.Item>
						<Form.Item
							name="first_name"
							label="First Name"
							rules={[
								{
									required: true,
									message: "First Name is required",
								},
							]}
						>
							<Input placeholder="Enter First Name" />
						</Form.Item>
						<Form.Item
							name="last_name"
							label="Last Name"
							rules={[
								{
									required: true,
									message: "Last Name is required",
								},
							]}
						>
							<Input placeholder="Enter First Name" />
						</Form.Item>
						<Form.Item
							name="user_role"
							label="User Role"
							rules={[
								{
									required: true,
									message: "User Role is required",
								},
							]}
						>
							<Select
								options={[
									{ value: "user", label: "User" },
									{ value: "manager", label: "Manager" },
									{
										value: "super_administrator",
										label: "Super Administrator",
									},
								]}
							/>
						</Form.Item>
					</Form>
				</Modal>
				{/* View Details Modal */}
				{/* <Modal
					title="View Product Details"
					open={viewDetailsModalVisible}
					centered
					onOk={() => handleOk("viewdetails")}
					confirmLoading={confirmLoading}
					onCancel={() => handleCancel("viewdetails")}
				>
					<Form
						layout="vertical"
						form={viewDetailsForm}
						initialValues={{
							layout: "vertical",
							// user_role: "user",
						}}
						style={{ maxWidth: 600 }}
					>
						<Form.Item name="id" label="ID" hidden={true}>
							<Input />
						</Form.Item>
						<Form.Item
							name="vd_sku"
							label="SKU"
						>
							<Input placeholder="Enter Username" />
						</Form.Item>
						<Form.Item name="password" label="Password">
							<Input placeholder="Enter Password" />
						</Form.Item>
						<Form.Item
							name="first_name"
							label="First Name"
							rules={[
								{
									required: true,
									message: "First Name is required",
								},
							]}
						>
							<Input placeholder="Enter First Name" />
						</Form.Item>
						<Form.Item
							name="last_name"
							label="Last Name"
							rules={[
								{
									required: true,
									message: "Last Name is required",
								},
							]}
						>
							<Input placeholder="Enter First Name" />
						</Form.Item>
						<Form.Item
							name="user_role"
							label="User Role"
							rules={[
								{
									required: true,
									message: "User Role is required",
								},
							]}
						>
							<Select
								options={[
									{ value: "user", label: "User" },
									{ value: "manager", label: "Manager" },
									{
										value: "super_administrator",
										label: "Super Administrator",
									},
								]}
							/>
						</Form.Item>
					</Form>
				</Modal> */}
				<Drawer
					title="Product Details"
					placement="right"
					width={900}
					onClose={closeDrawer}
					open={viewDetailsOpen}
				>
					<Tabs
						defaultActiveKey="1"
						items={[
							{
								label: `Overview`,
								key: `1`,
								children: (
									<ViewDetailsOverviewTab
										product={productVariation}
										locations={locations}
										category={category}
									/>
								),
							},
						]}
					/>
				</Drawer>
			</div>
		</CommonLayout>
	);
}

export default ManageProducts;
