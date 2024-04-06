import CommonLayout from "../../components/CommonLayout";
import { UserService, User } from "@/utils/UserService";
import { useState, useEffect } from "react";
import "./ManageUsers.scss";
import type { TableColumnsType, TableProps } from "antd";
import { Table, Button, Modal, Form, Input, Select } from "antd";

type OnChange = NonNullable<TableProps<DataType>["onChange"]>;

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface DataType {
  username: string;
  first_name: string;
  last_name: string;
  user_role: string;
}

function ManageUsers({
  expandedItems,
  setExpandedItems,
}: {
  expandedItems: any;
  setExpandedItems: any;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      const users = await UserService.getUsers();
      setUsers(users);
    }

    fetchUsers();
  }, []);

  const data: DataType[] = users.map((user) => ({
    key: user.id,
    username: user.username || "",
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    user_role: user.user_role || "",
  }));

  const handleChange: OnChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setSortedInfo(sorter as Sorts);
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.length - b.username.length,
      sortOrder: sortedInfo.columnKey === "username" ? sortedInfo.order : null,
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
      sortOrder: sortedInfo.columnKey === "last_name" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "User Role",
      dataIndex: "user_role",
      key: "user_role",
      sorter: (a, b) => a.user_role.length - b.user_role.length,
      sortOrder: sortedInfo.columnKey === "user_role" ? sortedInfo.order : null,
      ellipsis: true,
    },
  ];

  const [addUserForm] = Form.useForm();
  const [editUserForm] = Form.useForm();

  const showModal = (modalType: string) => {
    if (modalType === "adduser") {
      setAddUserModalVisible(true);
    } else if (modalType === "edituser") {
      setEditUserModalVisible(true);
    }
  };

  const handleOk = async (modalType: string) => {
    if (modalType === "adduser") {
      try {
        await addUserForm.validateFields();
        await addUserForm.resetFields();
        await setAddUserModalVisible(false);
        await setConfirmLoading(false);
      } catch (errors) {
        setConfirmLoading(false);
        // console.error("Form validation errors:", errors);
      }
    } else if (modalType === "edituser") {
      try {
        await editUserForm.validateFields();
        await editUserForm.resetFields();
        await setEditUserModalVisible(false);
        await setConfirmLoading(false);
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

  return (
    <CommonLayout
      pageName="manageUsers"
      breadCrumbText="View Users"
      expandedItems={expandedItems}
      setExpandedItems={setExpandedItems}
    >
      <div>
        <div className="top_section">
          <Button type="primary" onClick={() => showModal("adduser")}>
            Add User
          </Button>
          <Button type="primary" onClick={() => showModal("edituser")}>
            Edit User
          </Button>
        </div>
        <Table columns={columns} dataSource={data} onChange={handleChange} />
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
            initialValues={{ layout: "vertical", user_role: "user" }}
            style={{ maxWidth: 600 }}
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Username is required" }]}
            >
              <Input placeholder="Enter Username" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input placeholder="Enter Password" />
            </Form.Item>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: "First Name is required" }]}
            >
              <Input placeholder="Enter First Name" />
            </Form.Item>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: "Last Name is required" }]}
            >
              <Input placeholder="Enter Last Name" />
            </Form.Item>
            <Form.Item
              name="user_role"
              label="User Role"
              rules={[{ required: true, message: "User Role is required" }]}
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
            initialValues={{ layout: "vertical", user_role: "user" }}
            style={{ maxWidth: 600 }}
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Username is required" }]}
            >
              <Input placeholder="Enter Username" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input placeholder="Enter Password" />
            </Form.Item>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: "First Name is required" }]}
            >
              <Input placeholder="Enter First Name" />
            </Form.Item>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: "Last Name is required" }]}
            >
              <Input placeholder="Enter First Name" />
            </Form.Item>
            <Form.Item
              name="user_role"
              label="User Role"
              rules={[{ required: true, message: "User Role is required" }]}
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
