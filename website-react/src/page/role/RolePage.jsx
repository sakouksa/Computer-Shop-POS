import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { CgInsertBeforeO } from "react-icons/cg";
import Item from "antd/es/list/Item";
//Import icon
import { CiCloudOn, CiEdit } from "react-icons/ci";
import { request } from "../../util/request";
import { AiOutlineUserAdd } from "react-icons/ai";
import { RiSave3Fill } from "react-icons/ri";
// import dayJs
import dayjs from "dayjs";
import { dateClient } from "../../util/helper";
import { MdDelete } from "react-icons/md";
function RolePage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false,
  });
  useEffect(() => {
    getlist();
  }, []);
  // posts Function
  const getlist = async () => {
    setState((pre) => ({ ...pre, loading: true })); // បើក Loading
    const res = await request("role", "get", {});
    if (res) {
      setState((pre) => ({
        ...pre,
        total: res.total,
        list: res.list || [], // ការពារកុំឱ្យ Error បើ Backend ផ្ញើមកទទេ
        loading: false, // off Loading
      }));
    } else {
      setState((pre) => ({ ...pre, loading: false }));
    }
  };
  // handle Open Modal
  const handleOpenModal = () => {
    setState((pre) => ({ ...pre, open: true }));
  };
  // handle Close Modal
  const handleCloseModal = () => {
    setState((pre) => ({ ...pre, open: false }));
    formRef.resetFields();
  };
  // onFinish function new role form
  const onFinish = async (item) => {
    let data = {
      name: item.name,
      code: item.code,
      description: item.description,
      status: item.status,
    };
    const res = await request("role", "post", data);
    if (res && !res.error) {
      //show success message
      message.success("Role created successfully!");
      handleCloseModal(); // of Modal
      getlist();
    } else {
      message.error(res?.message || "Failed to create role!");
    }
  };
  return (
    <div>
      <div className="main-page-header">
        <Space>
          <div>Role{state.total}</div>
          <Input.Search allowClear placeholder="Search Roles" />
        </Space>
        <Button
          type="primary"
          onClick={handleOpenModal}
          icon={<AiOutlineUserAdd />}
        >
          New Role
        </Button>
      </div>
      {/* Modal for New Role */}
      <Modal
        title="New Role"
        open={state.open}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item
            label="Name"
            name={"name"}
            rules={[{ required: true, message: "Please input role name!" }]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>
          <Form.Item
            label="Code"
            name={"code"}
            rules={[{ required: true, message: "Please input role code!" }]}
          >
            <Input placeholder="Enter role code" />
          </Form.Item>
          <Form.Item label="Description" name={"description"}>
            <Input.TextArea placeholder="Enter role description" />
          </Form.Item>
          <Form.Item label="Status" name={"status"}>
            <Select
              placeholder="Select role status"
              options={[
                { label: "Active", value: 1 },
                { label: "Inactive", value: 0 },
              ]}
            />
          </Form.Item>
          {/* Form Item for buttons */}
          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Space>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="primary" htmlType="submit" icon={<RiSave3Fill />}>
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        dataSource={state.list}
        loading={state.loading}
        scroll={{ x: 800 }}
        columns={[
          {
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "code",
            title: "Code",
            dataIndex: "code",
          },
          {
            key: "description",
            title: "Description",
            dataIndex: "description",
          },
          {
            key: "status",
            title: "Status",
            dataIndex: "status",
            render: (value) =>
              value ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Inactive</Tag>
              ),
          },
          {
            key: "created_at",
            title: "Created At",
            dataIndex: "created_at",
            render: (value) => dateClient(value, "DD/MM/YYYY HH:mm"),
          },
          {
            key: "action",
            title: "Action",
            align: "center",
            render: () => (
              <Space>
                <Button type="primary" icon={<CiEdit />} />
                <Button danger icon={<MdDelete />} />
              </Space>
            ),
          },
        ]}
      ></Table>
    </div>
  );
}
export default RolePage;
