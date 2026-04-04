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
import { CiEdit } from "react-icons/ci";
import { request } from "../../util/request";
import { RiSave3Fill } from "react-icons/ri";
import { FilterOutlined } from "@ant-design/icons";
import { IoMdAddCircle } from "react-icons/io";
import { dateClient } from "../../util/helper";
import { MdDelete } from "react-icons/md";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { BiSolidEditAlt } from "react-icons/bi";
import MainPage from "../../component/layout/MainPage";

function CustomerPage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false,
  });

  const [filter, setFilter] = useState({
    text_search: "",
    status: "",
  });

  const [validate, setValidate] = useState({});

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = async () => {
    setState((pre) => ({ ...pre, loading: true }));
    let query_param = "?page=1";
    if (filter.text_search !== null && filter.text_search !== "") {
      query_param += "&text_search=" + filter.text_search;
    }
    if (filter.status !== null && filter.status !== "") {
      query_param += "&status=" + filter.status;
    }

    const res = await request("customer" + query_param, "get", {});
    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        total: res.total,
        list: res.list || [],
        loading: false,
      }));
    } else {
      setState((pre) => ({ ...pre, loading: false }));
      if (res.errors?.message) {
        message.error(res.errors?.message);
      }
    }
  };

  const handleOpenModal = () => {
    setState((pre) => ({ ...pre, open: true }));
  };

  const handleCloseModal = () => {
    setState((pre) => ({ ...pre, open: false }));
    formRef.resetFields();
    setValidate({});
  };

  const onFinish = async (item) => {
    let data = {
      ...item,
    };

    let url = "customer";
    let method = "post";

    if (formRef.getFieldValue("id")) {
      url += "/" + formRef.getFieldValue("id");
      method = "put";
    }

    const res = await request(url, method, data);
    if (res && !res.errors) {
      message.success(res.message || "ជោគជ័យ!");
      handleCloseModal();
      getList();
    } else {
      setValidate(res.errors || {});
      message.error(res?.message || "ប្រតិបត្តិការបរាជ័យ!");
    }
  };

  const handleDelete = async (data) => {
    Modal.confirm({
      title: "បញ្ជាក់ការលុប",
      icon: <ExclamationCircleFilled style={{ color: "#ff4d4f" }} />,
      content: "តើអ្នកពិតជាចង់លុបមែនដែរឬទេ?",
      okText: "លុបចេញ",
      okType: "danger",
      cancelText: "បោះបង់",
      centered: true,
      onOk: async () => {
        const res = await request(`customer/${data.id}`, "delete", {});
        if (res && !res.error) {
          message.success(res.message || "លុបបានជោគជ័យ!");
          getList();
        } else {
          message.error(res?.message || "មានបញ្ហាក្នុងការលុប!");
        }
      },
    });
  };

  const handleEdit = (data) => {
    formRef.setFieldsValue({
      ...data,
    });
    setState((p) => ({ ...p, open: true }));
  };

  const handleFilter = () => {
    getList();
  };

  return (
    <MainPage loading={state.loading}>
      <div>
        <div className="main-page-header">
          <Space>
            <div>អតិថិជនសរុប: {state.list.length}</div>
            <Input.Search
              allowClear
              onChange={(e) =>
                setFilter((p) => ({ ...p, text_search: e.target.value }))
              }
              placeholder="ស្វែងរកអតិថិជន..."
              onSearch={handleFilter}
            />
            <Select
              allowClear
              placeholder="ជ្រើសរើសស្ថានភាព"
              style={{ width: 150 }}
              onChange={(value) => setFilter((p) => ({ ...p, status: value }))}
              options={[
                { label: "ទាំងអស់", value: "" },
                { label: "សកម្ម", value: 1 },
                { label: "អសកម្ម", value: 0 },
              ]}
            />
            <Button
              type="primary"
              onClick={handleFilter}
              icon={<FilterOutlined />}
            >
              ច្រោះទិន្នន័យ
            </Button>
          </Space>
          <Button
            type="primary"
            onClick={handleOpenModal}
            icon={<IoMdAddCircle style={{ fontSize: "18px" }} />}
            style={{
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            បង្កើតអតិថិជន
          </Button>
        </div>

        <Modal
          title={
            formRef.getFieldValue("id") ? "កែប្រែអតិថិជន" : "បង្កើតអតិថិជនថ្មី"
          }
          open={state.open}
          onCancel={handleCloseModal}
          centered
          width={600}
          footer={null}
          maskClosable={false}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Form.Item
              label="ឈ្មោះអតិថិជន"
              name="name"
              {...validate.name}
              rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះអតិថិជន!" }]}
            >
              <Input placeholder="បញ្ចូលឈ្មោះអតិថិជន" />
            </Form.Item>

            <Form.Item
              label="អ៊ីម៉ែល"
              name="email"
              {...validate.email}
              rules={[
                { required: true, message: "សូមបញ្ចូលអ៊ីម៉ែល!" },
                { type: "email", message: "ទម្រង់អ៊ីម៉ែលមិនត្រឹមត្រូវ!" },
              ]}
            >
              <Input placeholder="បញ្ចូលអ៊ីម៉ែល" />
            </Form.Item>

            <Form.Item
              label="លេខទូរស័ព្ទ"
              name="phone"
              {...validate.phone}
              rules={[{ required: true, message: "សូមបញ្ចូលលេខទូរស័ព្ទ!" }]}
            >
              <Input placeholder="បញ្ចូលលេខទូរស័ព្ទ" />
            </Form.Item>

            <Form.Item label="អាស័យដ្ឋាន" name="address">
              <Input.TextArea
                placeholder="បញ្ចូលអាស័យដ្ឋាន..."
                rows={3}
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item label="ស្ថានភាព" name="status" initialValue={1}>
              <Select
                options={[
                  { label: "សកម្ម", value: 1 },
                  { label: "អសកម្ម", value: 0 },
                ]}
              />
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

        <Table
          dataSource={state.list}
          loading={state.loading}
          rowKey="id"
          scroll={{ x: 800 }}
          columns={[
            { title: "ឈ្មោះ", dataIndex: "name", key: "name" },
            { title: "អ៊ីម៉ែល", dataIndex: "email", key: "email" },
            { title: "លេខទូរស័ព្ទ", dataIndex: "phone", key: "phone" },
            { title: "អាស័យដ្ឋាន", dataIndex: "address", key: "address" },
            {
              title: "ស្ថានភាព",
              dataIndex: "status",
              render: (v) => (
                <Tag color={v === 1 ? "green" : "red"}>
                  {v === 1 ? "សកម្ម" : "អសកម្ម"}
                </Tag>
              ),
            },
            {
              title: "ថ្ងៃបង្កើត",
              dataIndex: "created_at",
              render: (v) => dateClient(v),
            },
            {
              title: "សកម្មភាព",
              align: "center",
              fixed: "right",
              width: 120,
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
