import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
// Import icons
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { RiSave3Fill } from "react-icons/ri";
import { BiSolidEditAlt } from "react-icons/bi";
import { ExclamationCircleFilled } from "@ant-design/icons";
// Import utilities
import { request } from "../../util/request";
import { dateClient } from "../../util/helper";
import MainPage from "../../component/layout/MainPage";

function CustomerPage() {
  const [formRef] = Form.useForm();

  // State management for list data, loading status, and modal visibility
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false,
  });

  // Fetch customer list on component mount
  useEffect(() => {
    getlist();
  }, []);

  // Function to fetch customer data from the server
  const getlist = async () => {
    setState((pre) => ({ ...pre, loading: true })); // Start loading
    const res = await request("customer", "get", {});
    if (res) {
      setState((pre) => ({
        ...pre,
        total: res.total || 0,
        list: res.list || [], // Prevent error if backend returns null
        loading: false, // Stop loading
      }));
    } else {
      setState((pre) => ({ ...pre, loading: false }));
    }
  };

  // Open modal for creating a new customer
  const handleOpenModal = () => {
    setState((pre) => ({ ...pre, open: true }));
  };

  // Close modal and clear form fields
  const handleCloseModal = () => {
    setState((pre) => ({ ...pre, open: false }));
    formRef.resetFields();
  };

  // Function to handle form submission for creating or updating
  const onFinish = async (item) => {
    let data = {
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      // status: item.status, // Add this if your customer has status field
    };

    let url = "customer";
    let method = "post";

    // If ID exists, switch to update mode (PUT)
    if (formRef.getFieldValue("id") !== undefined) {
      url += "/" + formRef.getFieldValue("id");
      method = "put";
    }

    const res = await request(url, method, data);
    if (res && !res.error) {
      message.success(res.message || "រក្សាទុកបានជោគជ័យ!");
      handleCloseModal();
      getlist();
    } else {
      message.error(res?.message || "បរាជ័យក្នុងការរក្សាទុក!");
    }
  };

  // Confirm and handle customer deletion
  const handleDelete = async (data) => {
    Modal.confirm({
      title: "បញ្ជាក់ការលុប",
      icon: <ExclamationCircleFilled style={{ color: "#ff4d4f" }} />,
      content: (
        <div style={{ paddingTop: 10 }}>
          តើអ្នកពិតជាចង់លុបអតិថិជន <strong>"{data.name}"</strong> មែនដែរឬទេ?
        </div>
      ),
      okText: "លុបចេញ",
      okType: "danger",
      cancelText: "បោះបង់",
      centered: true,
      okButtonProps: { style: { borderRadius: "6px" } },
      cancelButtonProps: { style: { borderRadius: "6px" } },
      onOk: async () => {
        const res = await request(`customer/${data.id}`, "delete", {});
        if (res && !res.error) {
          message.success(res.message || "លុបបានជោគជ័យ!");
          getlist();
        } else {
          message.error(res?.message || "មានបញ្ហាក្នុងការលុប!");
        }
      },
    });
  };

  // Populate form and open modal for editing
  const handleEdit = async (data) => {
    formRef.setFieldsValue({
      ...data,
      id: data.id,
    });
    setState((p) => ({ ...p, open: true }));
  };

  return (
    <MainPage loading={state.loading}>
      <div>
        {/* Header section with total count, search, and add button */}
        <div className="main-page-header">
          <Space>
            <div>អតិថិជនសរុប: {state.list.length}</div>
            <Input.Search allowClear placeholder="ស្វែងរកអតិថិជន..." />
          </Space>
          <Button
            type="primary"
            onClick={handleOpenModal}
            icon={<AiOutlineUserAdd />}
          >
            បង្កើតថ្មី
          </Button>
        </div>

        {/* Modal for Create/Edit Form */}
        <Modal
          title={
            formRef.getFieldValue("id")
              ? "កែប្រែព័ត៌មានអតិថិជន"
              : "បន្ថែមអតិថិជនថ្មី"
          }
          open={state.open}
          onCancel={handleCloseModal}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Form.Item
              label="ឈ្មោះអតិថិជន"
              name="name"
              rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះអតិថិជន!" }]}
            >
              <Input placeholder="បញ្ចូលឈ្មោះអតិថិជន" />
            </Form.Item>
            <Form.Item label="អ៊ីមែល" name="email">
              <Input placeholder="បញ្ចូលអ៊ីមែល" />
            </Form.Item>
            <Form.Item
              label="លេខទូរស័ព្ទ"
              name="phone"
              rules={[{ required: true, message: "សូមបញ្ចូលលេខទូរស័ព្ទ!" }]}
            >
              <Input placeholder="បញ្ចូលលេខទូរស័ព្ទ" />
            </Form.Item>
            <Form.Item label="អាសយដ្ឋាន" name="address">
              <Input.TextArea placeholder="បញ្ចូលអាសយដ្ឋាន..." />
            </Form.Item>

            <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
              <Space>
                <Button onClick={handleCloseModal}>បោះបង់</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={
                    formRef.getFieldValue("id") ? (
                      <BiSolidEditAlt />
                    ) : (
                      <RiSave3Fill />
                    )
                  }
                >
                  {formRef.getFieldValue("id")
                    ? "ធ្វើបច្ចុប្បន្នភាព"
                    : "រក្សាទុក"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Customer list table */}
        <Table
          dataSource={state.list}
          scroll={{ x: 800 }}
          columns={[
            {
              key: "name",
              title: "ឈ្មោះ",
              dataIndex: "name",
            },
            {
              key: "email",
              title: "អ៊ីមែល",
              dataIndex: "email",
            },
            {
              key: "phone",
              title: "លេខទូរស័ព្ទ",
              dataIndex: "phone",
            },
            {
              key: "address",
              title: "អាសយដ្ឋាន",
              dataIndex: "address",
            },
            {
              key: "created_at",
              title: "ថ្ងៃបង្កើត",
              dataIndex: "created_at",
              render: (value) => dateClient(value),
            },
            {
              key: "action",
              title: "សកម្មភាព",
              align: "center",
              render: (data) => (
                <Space>
                  <Button
                    type="text"
                    onClick={() => handleEdit(data)}
                    icon={<CiEdit style={{ fontSize: 18, color: "#004EBC" }} />}
                  />
                  <Button
                    type="text"
                    danger
                    onClick={() => handleDelete(data)}
                    icon={<MdDelete style={{ fontSize: 18 }} />}
                  />
                </Space>
              ),
            },
          ]}
        />
      </div>
    </MainPage>
  );
}

export default CustomerPage;
