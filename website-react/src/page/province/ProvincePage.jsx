import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  notification,
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
// iocn reactJs
import { dateClient } from "../../util/helper";
import { MdDelete } from "react-icons/md";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { BiSolidEditAlt } from "react-icons/bi";
import MainPage from "../../component/layout/MainPage";
import { IoMdAddCircle } from "react-icons/io";

function ProvincePage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false,
    validate: {},
  });
  // កំណត់ឱ្យសារបង្ហាញនៅខាងស្តាំដៃផ្នែកខាងលើ
  message.config({
    placement: "topRight",
    duration: 3,
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
    // console.log("provincepage : ", res);
    // រៀបចំ Query Params
    let query_param = "?page=1";
    if (filter.text_search != null && filter.text_search != "") {
      query_param += "&text_search=" + filter.text_search;
    }
    if (filter.status != null && filter.status != "") {
      query_param += "&status=" + filter.status;
    }
    //localhost:8001/api/province?page1&text_search=admin&status=0 //query parameter
    // ទាញទិន្នន័យ (ហៅ request មុននឹងប្រើ res)
    const res = await request("province" + query_param, "get", {});
    console.log("provincepage:", res);
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
    formRef.setFieldValue("status", 1);
    setState((pre) => ({ ...pre, open: true }));
  };

  // handle Close Modal
  const handleCloseModal = () => {
    setState((pre) => ({ ...pre, open: false }));
    formRef.resetFields();
    setValidate({});
  };

  // onFinish function new province form
  const onFinish = async (item) => {
    let data = {
      name: item.name,
      code: item.code,
      description: item.description,
      status: item.status,
      distand_from_city: item.distand_from_city,
    };

    let url = "province";
    let method = "post";

    if (formRef.getFieldValue("id") != undefined) {
      url += "/" + formRef.getFieldValue("id");
      method = "put";
    }

    const res = await request(url, method, data);
    if (res && !res.errors) {
      // ប្តូរពី message.success មក notification.success
      notification.success({
        message: 'ជោគជ័យ',
        description: res.message,
        placement: 'topRight', // កំណត់ឱ្យនៅខាងស្តាំដៃ
      });
      handleCloseModal();
      getlist();
    } else {
      setState((p) => ({
        ...p,
        loading: false,
      }));
      setValidate(res.errors);
      // ប្តូរពី message.error មក notification.error
      notification.error({
        message: 'ប្រតិបត្តិការបរាជ័យ',
        description: res?.message,
        placement: 'topRight',
      });
    }
  }

  // handle Delete province
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
        const res = await request(`province/${data.id}`, "delete", {});
        if (res && !res.error) {
          message.success(res.message || "លុបបានជោគជ័យ!");
          getlist();
        } else {
          message.error(res?.message || "មានបញ្ហាក្នុងការលុប!");
        }
      },
    });
  };

  //handle Edit province
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
          title={
            formRef.getFieldValue("id")
              ? "កែប្រែខេត្ត/ក្រុង"
              : "បង្កើតខេត្ត/ក្រុង"
          }
          open={state.open}
          onCancel={handleCloseModal}
          centered
          width={600}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Form.Item
              label="ឈ្មោះខេត្ត/ក្រុង"
              name={"name"}
              {...validate.name}
              rules={[
                { required: true, message: "សូមបញ្ចូលឈ្មោះខេត្ត/ក្រុង!" },
              ]}
            >
              <Input placeholder="សូមបញ្ចូលឈ្មោះខេត្ត/ក្រុង" />
            </Form.Item>
            <Form.Item
              label="កូដ"
              name={"code"}
              {...validate.code}
              rules={[{ required: true, message: "សូមបញ្ចូលកូដ!" }]}
            >
              <Input placeholder="បញ្ចូលកូដតួនាទី" />
            </Form.Item>
            <Form.Item
              label="ចម្ងាយពីកណ្តាលក្រុង(គីឡូម៉ែត្រ)"
              name={"distand_from_city"}
              {...validate.distand_from_city}
              rules={[
                {
                  required: true,
                  message: "មបញ្ចូលចម្ងាយពីកណ្តាលក្រុង(គីឡូម៉ែត្រ)!",
                },
              ]}
            >
              <Input placeholder="សូមបញ្ចូលចម្ងាយពីកណ្តាលក្រុង(គីឡូម៉ែត្រ)!" />
            </Form.Item>
            <Form.Item label="ការពិពណ៌នា" name="description">
              <Input.TextArea
                placeholder="ព័ត៌មានបន្ថែមអំពីតំបន់ប្រវត្តិសាស្ត្រ និងកសិឧស្សាហកម្ម..."
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
              key: "code",
              title: "កូដ",
              dataIndex: "code",
            },
            {
              key: "description",
              title: "ការពិពណ៌នា",
              dataIndex: "description",
              width: 500,
              render: (text) => (
                <div
                  style={{
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                    textAlign: "left",
                    fontSize: "13px",
                    color: "#555",
                  }}
                >
                  {text}
                </div>
              ),
            },
            {
              key: "distand_from_city",
              title: "ចម្ងាយពីកណ្តាលក្រុង",
              dataIndex: "distand_from_city",
              render: (value) => value + "គីឡូម៉ែត្រ",
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
export default ProvincePage;
