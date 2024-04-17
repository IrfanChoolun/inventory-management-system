import CommonLayout from "../../components/CommonLayout";
import { UserService, User } from "@/utils/UserService";
import { useState, useEffect } from "react";
import "./ManageUsers.scss";
import type { TableColumnsType, TableProps } from "antd";
import { Table, Button, Modal, Form, Input, Select, Popconfirm } from "antd";
import { ObjectId } from "bson";

type OnChange = NonNullable<TableProps<DataType>["onChange"]>;

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface DataType {
	key: ObjectId;
	username: string;
	first_name: string;
	last_name: string;
	user_role: string;
}

function ManageUsers({
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
	const [users, setUsers] = useState<User[]>([]);
	const [sortedInfo, setSortedInfo] = useState<Sorts>({});
	const [addUserModalVisible, setAddUserModalVisible] = useState(false);
	const [editUserModalVisible, setEditUserModalVisible] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);

	useEffect(() => {
		fetchUsers();
	}, []);

	async function fetchUsers() {
		const users = await UserService.getUsers();
		setUsers(users);
	}

	// console.log(users);

	const data: DataType[] = users.map((user) => {
		const userRole =
			user.user_role === "super_administrator"
				? "Super Administrator"
				: user.user_role === "manager"
				? "Manager"
				: "User";
		return {
			key: user.id ? user.id : new ObjectId(),
			username: user.username || "",
			first_name: user.first_name || "",
			last_name: user.last_name || "",
			user_role: userRole,
		};
	});

	const handleChange: OnChange = (pagination, filters, sorter) => {
		console.log("Various parameters", pagination, filters, sorter);
		setSortedInfo(sorter as Sorts);
	};

	const columns: TableColumnsType<DataType> = [
		{
			title: "ID",
			dataIndex: "key",
			key: "key",
			hidden: true,
		},
		{
			title: "Username",
			dataIndex: "username",
			key: "username",
			sorter: (a, b) => a.username.length - b.username.length,
			sortOrder:
				sortedInfo.columnKey === "username" ? sortedInfo.order : null,
			ellipsis: true,
		},
		{
			title: "First Name",
			dataIndex: "first_name",
			key: "first_name",
			sorter: (a, b) => a.first_name.length - b.first_name.length,
			sortOrder:
				sortedInfo.columnKey === "first_name" ? sortedInfo.order : null,
			ellipsis: true,
		},
		{
			title: "Last Name",
			dataIndex: "last_name",
			key: "last_name",
			sorter: (a, b) => a.last_name.length - b.last_name.length,
			sortOrder:
				sortedInfo.columnKey === "last_name" ? sortedInfo.order : null,
			ellipsis: true,
		},
		{
			title: "User Role",
			dataIndex: "user_role",
			key: "user_role",
			sorter: (a, b) => a.user_role.length - b.user_role.length,
			sortOrder:
				sortedInfo.columnKey === "user_role" ? sortedInfo.order : null,
			ellipsis: true,
		},
		{
			title: "Action",
			key: "action",
			render: (_, record) => (
				<>
					<a onClick={() => handleEdit(record.key)}>Edit</a>
					<span> | </span>
					<Popconfirm
						title="Are you sure you want to delete this user?"
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

	const [addUserForm] = Form.useForm();
	const [editUserForm] = Form.useForm();

	const handleOk = async (modalType: string) => {
		if (modalType === "adduser") {
			try {
				await addUserForm.validateFields();
				// add user to database
				const values = addUserForm.getFieldsValue();
				// console.log("Received values of form: ", values); // { username: "username", password: "password", first_name: "first_name", last_name: "last_name", user_role: "user" }
				const res = await UserService.addUser(values);
				if (res) {
					await fetchUsers();
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
					await fetchUsers();
					console.log(res);
					// console.log("i am here");
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

	const handleEdit = (id: ObjectId) => {
		const user = users.find((user) => user.id === id);
		if (user) {
			editUserForm.setFieldsValue({
				id: user.id,
				username: user.username,
				first_name: user.first_name,
				last_name: user.last_name,
				user_role: user.user_role,
			});

			setEditUserModalVisible(true);
		}
	};

	const handleDelete = async (id: ObjectId) => {
		const user = users.find((user) => user.id === id);
		if (user) {
			await UserService.deleteUser(user);
			await fetchUsers();
		}
	};

	return (
		<CommonLayout
			pageName="manageUsers"
			// breadCrumbText="View Users"
			expandedItems={expandedItems}
			setExpandedItems={setExpandedItems}
			globalUser={globalUser}
			setGlobalUser={setGlobalUser}
		>
			<div>
				<div className="top_section">
					<h5>Manage Users</h5>
					<Button
						type="primary"
						onClick={() => setAddUserModalVisible(true)}
					>
						Add User
					</Button>
				</div>
				<Table
					columns={columns}
					dataSource={data}
					onChange={handleChange}
				/>
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
			</div>
		</CommonLayout>
	);
}

export default ManageUsers;
