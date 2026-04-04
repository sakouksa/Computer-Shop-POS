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
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { IoMdAddCircle } from "react-icons/io";
// import dayJs

import { dateClient } from "../../util/helper";
import { MdDelete } from "react-icons/md";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { BiSolidEditAlt } from "react-icons/bi";
import MainPage from "../../component/layout/MainPage";

function CategoryPage() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [validate, setValidate] = useState({});
  // posts Function
  const getlist = async () => {
    setState((pre) => ({ ...pre, loading: true }));
    // console.log("categoriespage : ", res);
    // រៀបចំ Query Params
    let query_param = "?page=1";
    if (filter.text_search !== null && filter.text_search !== "") {
      query_param += "&text_search=" + filter.text_search;
    }
    if (filter.status !== null && filter.status !== "") {
      query_param += "&status=" + filter.status;
    }
    //localhost:8001/api/categories?page1&text_search=admin&status=0 //query parameter
    // ទាញទិន្នន័យ (ហៅ request មុននឹងប្រើ res)
    const res = await request("categories" + query_param, "get", {});
    console.log("categoriespage:", res);
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

  // onFinish function new categories form
  const onFinish = async (item) => {
    let data = {
      name: item.name,
      code: item.code,
      description: item.description,
      status: item.status,
      parent_id: item.parent_id,
    };

    let url = "categories";
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

  // handle Delete categories
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
        const res = await request(`categories/${data.id}`, "delete", {});
        if (res && !res.error) {
          message.success(res.message || "លុបបានជោគជ័យ!");
          getlist();
        } else {
          message.error(res?.message || "មានបញ្ហាក្នុងការលុប!");
        }
      },
    });
  };

  //handle Edit categories
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
              icon={<FilterOutlined />}
            >
              ច្រោះទិន្នន័យ
            </Button>
          </Space>
          <Button
            type="primary"
            onClick={handleOpenModal}
            icon={<IoMdAddCircle style={{ fontSize: "18px" }} />} // ប្រើ Icon ថ្មី
            style={{
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            បង្កើតថ្មី
          </Button>
        </div>
        {/* Modal Form Create update */}
        <Modal
          title={formRef.getFieldValue("id") ? "កែប្រែប្រភេទ" : "បង្កើតប្រភេទ"}
          open={state.open}
          onCancel={handleCloseModal}
          centered
          width={600}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Form.Item
              label="ឈ្មោះប្រភេទ"
              name={"name"}
              {...validate.name}
              rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះប្រភេទ!" }]}
            >
              <Input placeholder="បញ្ចូលឈ្មោះប្រភេទ" />
            </Form.Item>
            <Form.Item
              label="លេខសម្គាល់មេ"
              name={"parent_id"}
              {...validate.parent_id}
              rules={[{ required: true, message: "សូមបញ្ចូលលេខសម្គាល់មេ!" }]}
            >
              <Input placeholder="បញ្ចូលលេខសម្គាល់មេ" />
            </Form.Item>
            <Form.Item label="ការពិពណ៌នា" name={"description"}>
              <Input.TextArea placeholder="ព័ត៌មានបន្ថែម..." />
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
          loading={state.loading}
          scroll={{ x: 800 }}
          columns={[
            {
              key: "name",
              title: "ឈ្មោះ",
              dataIndex: "name",
            },
            {
              key: "description",
              title: "ការពិពណ៌នា",
              dataIndex: "description",
            },
            {
              key: "parent_id",
              title: "លេខសម្គាល់មេ",
              dataIndex: "parent_id",
            },
            {
              key: "status",
              title: "ស្ថានភាព",
              dataIndex: "status",
              render: (value) =>
                value ? (
                  <Tag color="green">សកម្ម</Tag>
                ) : (
                  <Tag color="red">អសកម្ម</Tag>
                ),
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
export default CategoryPage;
