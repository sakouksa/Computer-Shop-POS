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
import { SearchOutlined } from "@ant-design/icons";
// import dayJs

import { dateClient } from "../../util/helper";
import { MdDelete } from "react-icons/md";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { BiSolidEditAlt } from "react-icons/bi";
import MainPage from "../../component/layout/MainPage";

function customerPage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false,
    validate: {},
  });
  // ការចាប់តម្លៃទុកក្នុង State ដើម្បីអោយ User វាយអក្សរ ឬរើសស្ថានភាព (Status)
  const [filter, setFilter] = useState({
    text_search: "",
    status: "",
  });

  useEffect(() => {
    getlist();
  }, []);
  const [validate, setValidate] = useState({});
  // posts Function
  const getlist = async () => {
    setState((pre) => ({ ...pre, loading: true }));
    // console.log("customerpage : ", res);
    // រៀបចំ Query Params
    let query_param = "?page=1";
    if (filter.text_search !== null && filter.text_search !== "") {
      query_param += "&text_search=" + filter.text_search;
    }
    if (filter.status !== null && filter.status !== "") {
      query_param += "&status=" + filter.status;
    }
    //localhost:8001/api/customer?page1&text_search=admin&status=0 //query parameter
    // ទាញទិន្នន័យ (ហៅ request មុននឹងប្រើ res)
    const res = await request("customer" + query_param, "get", {});
    console.log("customerpage:", res);
    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        total: res.total,
        list: res.list || [],
        loading: false,
      }));
    } else {
      setState((pre) => ({ ...pre, loading: false }));
      //ចាប់យក Error ពីរ backend
      if (res.errors?.message) {
        message.error(res.errors?.message);
      }
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
    setValidate({});
  };

  // onFinish function new customer form
  const onFinish = async (item) => {
    let data = {
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      status: item.status,
    };

    let url = "customer";
    let method = "post";

    if (formRef.getFieldValue("id") != undefined) {
      url += "/" + formRef.getFieldValue("id");
      method = "put";
    }

    const res = await request(url, method, data);
    if (res && !res.errors) {
      message.success(res.message || "ជោគជ័យ!");
      handleCloseModal();
      getlist();
    } else {
      setState((p) => ({
        ...p,
        loading: false,
      }));
      setValidate(res.errors);
      message.error(res?.message || "ប្រតិបត្តិការបរាជ័យ!");
    }
  };

  // handle Delete customer
  const handleDelete = async (data) => {
    Modal.confirm({
      title: "បញ្ជាក់ការលុប",
      icon: <ExclamationCircleFilled style={{ color: "#ff4d4f" }} />,
      content: (
        <div style={{ paddingTop: 10 }}>តើអ្នកពិតជាចង់លុបមែនដែរឬទេ?</div>
      ),
      okText: "លុបចេញ",
      okType: "danger",
      cancelText: "បោះបង់",
      centered: true,
      okButtonProps: { style: { borderRadius: "10px" } },
      cancelButtonProps: { style: { borderRadius: "10px" } },
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

  //handle Edit customer
  const handleEdit = async (data) => {
    formRef.setFieldsValue({
      ...data,
      id: data.id,
    });
    setState((p) => ({ ...p, open: true }));
  };
  const handleFilter = () => {
    getlist();
  };

  return (
    <MainPage loading={state.loading}>
      <div>
        <div className="main-page-header">
          <Space>
            <div>តួនាទីសរុប: {state.list.length}</div>
            <Input.Search
              allowClear
              onChange={(e) =>
                setFilter((p) => ({ ...p, text_search: e.target.value }))
              }
              placeholder="ស្វែងរកតួនាទី..."
            />
            <Select
              allowClear={true}
              placeholder="ជ្រើសរើសស្ថានភាព"
              style={{ width: 150 }}
              onChange={(value) => setFilter((p) => ({ ...p, status: value }))}
              options={[
                {
                  label: "ទាំងអស់",
                  value: null,
                },
                {
                  label: "សកម្ម",
                  value: 1,
                },
                {
                  label: "អសកម្ម",
                  value: 0,
                },
              ]}
            />
            <Button
              type="primary"
              onClick={handleFilter}
              icon={<SearchOutlined />} // បន្ថែម Icon ស្វែងរក
            >
              ស្វែងរក
            </Button>
          </Space>
          <Button
            type="primary"
            onClick={handleOpenModal}
            icon={<AiOutlineUserAdd />}
          >
            បង្កើតថ្មី
          </Button>
        </div>
        {/* Modal Form Create update */}
        <Modal
          title={
            formRef.getFieldValue("id") ? "កែប្រែអតិថិជន" : "បង្កើតអតិថិជនថ្មី"
          }
          open={state.open}
          onCancel={handleCloseModal}
          centered
          width={600}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Form.Item
              label="ឈ្មោះអតិថិជន"
              name={"name"}
              {...validate.name}
              rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះអតិថិជន!" }]}
            >
              <Input placeholder="បញ្ចូលឈ្មោះអតិថិជន" />
            </Form.Item>
            <Form.Item
              label="អ៊ីម៉ែល"
              name={"email"}
              {...validate.email}
              rules={[{ required: true, message: "សូមបញ្ចូលអ៊ីម៉ែល!" }]}
            >
              <Input placeholder="បញ្ចូលអ៊ីម៉ែល" />
            </Form.Item>
            <Form.Item
              label="លេខទូរស័ព្ទ"
              name={"phone"}
              {...validate.phone}
              rules={[{ required: true, message: "សូមបញ្ចូលលេខទូរស័ព្ទ!" }]}
            >
              <Input placeholder="បញ្ចូលលេខទូរស័ព្ទ" />
            </Form.Item>
            <Form.Item label="អាស័យដ្ឋាន" name="address">
              <Input.TextArea
                placeholder="បញ្ចូលអាស័យដ្ឋាន..."
                autoSize={{ minRows: 4, maxRows: 10 }} // កំណត់ឱ្យមានយ៉ាងតិច 4 ជួរ
                showCount // បង្ហាញចំនួនតួអក្សរ (មើលទៅអាជីពជាង)
                maxLength={1000}
              />
            </Form.Item>
            <Form.Item label="ស្ថានភាព" name={"status"}>
              <Select
                placeholder="ជ្រើសរើសស្ថានភាព"
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
        {/* End Modal Form Create update */}
        {/* Data table */}
        <Table
          dataSource={state.list}
          // loading={state.loading}
          scroll={{ x: 800 }}
          columns={[
            {
              key: "name",
              title: "ឈ្មោះ",
              dataIndex: "name",
            },
            {
              key: "email",
              title: "អ៊ីម៉ែល",
              dataIndex: "email",
            },
            {
              key: "phone",
              title: "លេទទូរស័ព្ទ",
              dataIndex: "phone",
            },
            {
              key: "address",
              title: "អាស័យដ្ឋាន",
              dataIndex: "address",
            },
            {
              key: status,
              title: "ស្ថានភាព",
              dataIndex: "status",
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
export default customerPage;
