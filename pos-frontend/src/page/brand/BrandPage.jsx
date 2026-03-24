import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Image,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from "antd";
import { CiEdit } from "react-icons/ci";
import { request } from "../../util/request";
import { RiSave3Fill } from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";
import { IoMdAddCircle } from "react-icons/io";
import { dateClient } from "../../util/helper";
import { MdDelete } from "react-icons/md";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { BiSolidEditAlt } from "react-icons/bi";
import MainPage from "../../component/layout/MainPage";
import config from "../../util/config";
import UploadButton from "../../component/button/UploadButton";
import { name } from "dayjs/locale/km";

function BrandPage() {
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
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    getlist();
  }, []);

  const getlist = async () => {
    setState((pre) => ({ ...pre, loading: true }));
    let query_param = "?page=1";
    if (filter.text_search) {
      query_param += "&text_search=" + filter.text_search;
    }
    if (filter.status) {
      query_param += "&status=" + filter.status;
    }

    const res = await request("brand" + query_param, "get", {});
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
    const formData = new FormData();
    formData.append("name", item.name);
    formData.append("code", item.code);
    formData.append("from_country", item.from_country);
    formData.append("status", item.status || "active");

    // ករណីមានការ Upload រូបភាពថ្មី
    if (fileList.length > 0 && fileList[0].originFileObj) {
      // បើមាន file ថ្មីដែលទើបជ្រើសរើស (ទាំង Insert និង Update)
      formData.append("image", fileList[0].originFileObj);
    } else if (fileList.length === 0 && formRef.getFieldValue("id")) {
      // បើ fileList ទទេ ហើយជាការ Update មានន័យថា User លុបរូបចោល
      let image_remove = formRef.getFieldValue("image");
      if (image_remove) {
        formData.append("image_remove", image_remove);
      }
    }
    let url = "brand";
    let method = "post";

    if (formRef.getFieldValue("id")) {
      url += "/" + formRef.getFieldValue("id");
      method = "post";
      formData.append("_method", "PUT");
    }

    const res = await request(url, method, formData);
    if (res && !res.errors) {
      message.success(res.message || "ជោគជ័យ!");
      handleCloseModal();
      getlist();
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
        const res = await request(`brand/${data.id}`, "delete", {});
        if (res && !res.error) {
          message.success(res.message || "លុបបានជោគជ័យ!");
          getlist();
        } else {
          message.error(res?.message || "មានបញ្ហាក្នុងការលុប!");
        }
      },
    });
  };

  const handleEdit = (data) => {
    setFileList([
      {
        uid: data.id,
        name: data.image,
        status: "done",
        url: config.image_path + data.image,
      },
    ]);
    formRef.setFieldsValue({
      ...data,
    });
    setState((p) => ({ ...p, open: true }));
  };

  const handleFilter = () => {
    getlist();
  };

  return (
    <MainPage loading={state.loading}>
      <div>
        <div
          className="main-page-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Space>
            <div>ម៉ាកផលិតផលសរុប: {state.list.length}</div>
            <Input.Search
              allowClear
              onChange={(e) =>
                setFilter((p) => ({ ...p, text_search: e.target.value }))
              }
              placeholder="ស្វែងម៉ាកផលិតផល..."
              onSearch={handleFilter}
            />
            <Select
              allowClear
              placeholder="ជ្រើសរើសស្ថានភាព"
              style={{ width: 150 }}
              onChange={(value) => setFilter((p) => ({ ...p, status: value }))}
              options={[
                { label: "សកម្ម", value: "active" },
                { label: "អសកម្ម", value: "inactive" },
              ]}
            />
            <Button
              type="primary"
              onClick={handleFilter}
              icon={<SearchOutlined />}
            >
              ច្រោះទិន្នន័យ
            </Button>
          </Space>
          <Button
            type="primary"
            onClick={handleOpenModal}
            icon={<IoMdAddCircle style={{ fontSize: "18px" }} />}
            style={{ borderRadius: "8px" }}
          >
            បង្កើតថ្មី
          </Button>
        </div>

        <Modal
          title={
            formRef.getFieldValue("id")
              ? "កែប្រែម៉ាកផលិតផល"
              : "បង្កើតម៉ាកផលិតផល"
          }
          open={state.open}
          onCancel={handleCloseModal}
          centered
          width={600}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <Form.Item
                label="ឈ្មោះម៉ាក"
                name="name"
                {...validate.name}
                rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះម៉ាក!" }]}
              >
                <Input placeholder="បញ្ចូលឈ្មោះម៉ាក" />
              </Form.Item>

              <Form.Item
                label="កូដម៉ាក"
                name="code"
                {...validate.code}
                rules={[{ required: true, message: "សូមបញ្ចូលកូដ!" }]}
              >
                <Input placeholder="បញ្ចូលកូដផលិតផល" />
              </Form.Item>

              <Form.Item
                label="មកពីប្រទេស"
                name="from_country"
                {...validate.from_country}
                rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះប្រទេស!" }]}
              >
                <Input placeholder="ឧទាហរណ៍៖ កម្ពុជា, ជប៉ុន..." />
              </Form.Item>

              <Form.Item label="ស្ថានភាព" name="status">
                <Select
                  placeholder="ជ្រើសរើសស្ថានភាព"
                  options={[
                    { label: "សកម្ម", value: "active" },
                    { label: "អសកម្ម", value: "inactive" },
                  ]}
                />
              </Form.Item>
              <Form.Item label="រូបភាព" {...validate.image}>
                <Upload
                  customRequest={(e) => e.onSuccess("ok")}
                  listType="picture-card"
                  fileList={fileList}
                  onChange={({ fileList }) => {
                    setFileList(fileList);
                  }}
                  maxCount={1}
                >
                  <UploadButton />
                </Upload>
              </Form.Item>
            </div>

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
          rowKey="id"
          scroll={{ x: 800 }}
          columns={[
            { title: "ឈ្មោះ", dataIndex: "name", key: "name" },
            { title: "កូដផលិតផល", dataIndex: "code", key: "code" },
            {
              title: "មកពីប្រទេស",
              dataIndex: "from_country",
              key: "from_country",
            },
            {
              title: "រូបភាព",
              dataIndex: "image",
              key: "image",
              render: (image) =>
                image ? (
                  <Image
                    src={config.image_path + image}
                    width={50}
                    style={{ borderRadius: "4px" }}
                  />
                ) : (
                  <div style={{ color: "#ccc" }}>គ្មានរូបភាព</div>
                ),
            },
            {
              title: "ស្ថានភាព",
              dataIndex: "status",
              key: "status",
              render: (value) => (
                <Tag
                  color={value === "active" || value === 1 ? "green" : "red"}
                >
                  {value === "active" || value === 1 ? "សកម្ម" : "អសកម្ម"}
                </Tag>
              ),
            },
            {
              title: "ថ្ងៃបង្កើត",
              dataIndex: "created_at",
              key: "created_at",
              render: (value) => dateClient(value),
            },
            {
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

export default BrandPage;
