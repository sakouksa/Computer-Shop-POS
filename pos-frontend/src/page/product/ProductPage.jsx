import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
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
import { Row } from "antd";
import { CiEdit } from "react-icons/ci";
import { request } from "../../util/request";
import { RiSave3Fill } from "react-icons/ri";
import {
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { dateClient } from "../../util/helper";
import { MdDelete } from "react-icons/md";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { BiSolidEditAlt } from "react-icons/bi";
import MainPage from "../../component/layout/MainPage";
import config from "../../util/config";
import UploadButton from "../../component/button/UploadButton";
import { usePreviewStore } from "../../store/previewStore";
function ProductPage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    category: [],
    brand: [],
    total: 0,
    loading: false,
    open: false,
  });

  const [filter, setFilter] = useState({
    txt_search: null,
    status: null,
    category_id: null,
    brand_id: null,
  });

  const [validate, setValidate] = useState({});
  const [fileList, setFileList] = useState([]);

  // call Zustand Store
  const { open, imgUrl, handleOpenPreview, handleClosePreview } =
    usePreviewStore();

  //  handlePreview
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    // ហៅ function ពី Zustand
    handleOpenPreview(file.url || file.preview);
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const getList = async (param_filter) => {
    param_filter = {
      ...filter,
      ...param_filter,
    };
    setState((pre) => ({ ...pre, loading: true }));
    let query_param = "?page=1";
    if (param_filter.txt_search !== null && param_filter.txt_search !== "") {
      query_param += "&txt_search=" + param_filter.txt_search;
    }
    if (param_filter.status !== null && param_filter.status !== "") {
      query_param += "&status=" + param_filter.status;
    }
    if (param_filter.category_id) {
      query_param += "&category_id=" + param_filter.category_id;
    }
    if (param_filter.brand_id) {
      query_param += "&brand_id=" + param_filter.brand_id;
    }

    const res = await request("products" + query_param, "get", {});
    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        total: res.total,
        list: res.list || [],
        category: res.category || [],
        brand: res.brand || [],
        loading: false,
      }));
    } else {
      setState((pre) => ({ ...pre, loading: false }));
      if (res.errors?.message) {
        message.error(res.errors?.message);
      }
    }
  };

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenModal = () => {
    setState((pre) => ({ ...pre, open: true }));
  };

  const handleCloseModal = () => {
    setState((pre) => ({ ...pre, open: false }));
    formRef.resetFields();
    setFileList([]); //close file image
    setValidate({});
  };

  const onFinish = async (item) => {
    const formData = new FormData();
    formData.append("product_name", item.product_name);
    formData.append("category_id", item.category_id);
    formData.append("brand_id", item.brand_id);
    formData.append("price", item.price);
    formData.append("quantity", item.quantity);
    formData.append("description", item.description || "");
    formData.append("status", item.status || 0);

    // ករណីមានការ Upload រូបភាពថ្មី
    if (fileList.length > 0 && fileList[0].originFileObj) {
      // បន្ថែមរូបភាពទៅ FormData
      formData.append("image", fileList[0].originFileObj);
    } else if (fileList.length === 0 && formRef.getFieldValue("id")) {
      // បើ fileList ទទេ ហើយជាការ Update មានន័យថា User លុបរូបចោល
      let image_remove = formRef.getFieldValue("image");
      if (image_remove) {
        formData.append("image_remove", image_remove);
      }
    }
    let url = "products";
    let method = "post";

    if (formRef.getFieldValue("id")) {
      url += "/" + formRef.getFieldValue("id");
      method = "post";
      formData.append("_method", "PUT");
    }
    setState((p) => ({ ...p, loading: true }));
    const res = await request(url, method, formData);
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
      content: (
        <div>
          តើអ្នកពិតជាចង់លុបមុខទំនិញ <b>"{data.product_name || data.title}"</b>{" "}
          នេះមែនដែរឬទេ?
          <p style={{ color: "#8c8c8c", fontSize: "12px", marginTop: "8px" }}>
            * សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយវិញបានទេ។
          </p>
        </div>
      ),
      okText: "លុបចេញ",
      okType: "danger",
      cancelText: "បោះបង់",
      centered: true,
      onOk: async () => {
        const res = await request(`products/${data.id}`, "delete", {});
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
    getList();
  };
  const handleReset = () => {
    const data = {
      txt_search: null,
      status: null,
      category_id: null,
      brand_id: null,
    };
    setFilter(data);
    getList(data);
  };

  return (
    <MainPage loading={state.loading}>
      <div>
        <div
          className="main-page-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <Space wrap size={[8, 16]} style={{ flex: 1 }}>
            <div className="text-lg font-medium">
              ផលិតផលសរុប: {state.list.length}
            </div>
            <Input.Search
              allowClear
              value={filter.txt_search}
              onChange={(e) =>
                setFilter((p) => ({ ...p, txt_search: e.target.value }))
              }
              placeholder="ស្វែងផលិតផល..."
              onSearch={handleFilter}
              style={{ width: 200 }}
            />
            <Select
              allowClear
              placeholder="ជ្រើសរើសស្ថានភាព"
              style={{ width: 140 }}
              value={filter.status}
              onChange={(value) => setFilter((p) => ({ ...p, status: value }))}
              options={[
                { label: "ទាំងអស់", value: "" },
                { label: "សកម្ម", value: 1 },
                { label: "អសកម្ម", value: 0 },
              ]}
            />
            <Select
              placeholder="ជ្រើសរើសប្រភេទ"
              style={{ width: 150 }}
              value={filter.category_id}
              onChange={(value) =>
                setFilter((p) => ({ ...p, category_id: value }))
              }
              options={state.category?.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
            <Select
              placeholder="ជ្រើសរើសម៉ាក"
              style={{ width: 130 }}
              value={filter.brand_id}
              onChange={(value) =>
                setFilter((p) => ({ ...p, brand_id: value }))
              }
              options={state.brand?.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
            <Button
              type="default"
              onClick={handleReset}
              icon={<ReloadOutlined />}
            >
              សម្អាត
            </Button>
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
            icon={<PlusOutlined />}
            style={{ borderRadius: "8px" }}
          >
            បន្ថែមថ្មី
          </Button>
        </div>
        <Modal
          title={
            formRef.getFieldValue("id") ? "កែប្រែផលិតផល" : "បង្កើតផលិតផលថ្មី"
          }
          open={state.open}
          onCancel={handleCloseModal}
          centered
          width={600}
          
          footer={null}
          maskClosable={false}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Row gutter={16}>
              {/* ឈ្មោះផលិតផល - Full Width */}
              <Col span={12}>
                <Form.Item
                  label="ឈ្មោះផលិតផល"
                  name="product_name"
                  {...validate.product_name}
                  rules={[{ required: true, message: "សូមបញ្ចូលឈ្មោះផលិតផល!" }]}
                >
                  <Input placeholder="បញ្ចូលឈ្មោះផលិតផល" />
                </Form.Item>
              </Col>

              {/* ប្រភេទផលិតផល & ម៉ាកផលិតផល - 50/50 Split */}
              <Col span={12}>
                <Form.Item
                  label="ប្រភេទផលិតផល"
                  name="category_id"
                  {...validate.category_id}
                  rules={[
                    { required: true, message: "សូមជ្រើសរើសប្រភេទផលិតផល!" },
                  ]}
                >
                  <Select
                    placeholder="ជ្រើសរើសប្រភេទ"
                    options={state.category?.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="ម៉ាកផលិតផល"
                  name="brand_id"
                  {...validate.brand_id}
                  rules={[
                    { required: true, message: "សូមជ្រើសរើសម៉ាកផលិតផល!" },
                  ]}
                >
                  <Select
                    placeholder="ជ្រើសរើសម៉ាក"
                    options={state.brand?.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                  />
                </Form.Item>
              </Col>

              {/* តម្លៃផលិតផល & ចំនួនផលិតផល - 50/50 Split */}
              <Col span={12}>
                <Form.Item
                  label="តម្លៃផលិតផល"
                  name="price"
                  {...validate.price}
                  rules={[{ required: true, message: "សូមបញ្ចូលតម្លៃផលិតផល!" }]}
                >
                  <Input
                    placeholder="បញ្ចូលតម្លៃផលិតផល"
                    type="number"
                    step="1"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="ចំនួនផលិតផល"
                  name="quantity"
                  {...validate.quantity}
                  rules={[{ required: true, message: "សូមបញ្ចូលចំនួនផលិតផល!" }]}
                >
                  <Input
                    placeholder="បញ្ចូលចំនួនផលិតផល"
                    type="number"
                    step="1"
                  />
                </Form.Item>
              </Col>

              {/* ស្ថានភាព - Full Width */}
              <Col span={12}>
                <Form.Item label="ស្ថានភាព" name="status">
                  <Select
                    placeholder="ជ្រើសរើសស្ថានភាព"
                    options={[
                      { label: "សកម្ម", value: 1 },
                      { label: "អសកម្ម", value: 0 },
                    ]}
                  />
                </Form.Item>
              </Col>

              {/* ពិពណ៌ផលិតផល - Full Width */}
              <Col span={24}>
                <Form.Item label="ពិពណ៌ផលិតផល" name="description">
                  <Input.TextArea
                    placeholder="បញ្ចូលពិពណ៌ផលិតផល"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </Form.Item>
              </Col>

              {/* រូបភាព - Full Width */}
              <Col span={24}>
                <Form.Item label="រូបភាព" {...validate.image}>
                  <Upload
                    customRequest={(e) => e.onSuccess("ok")}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={({ fileList }) => setFileList(fileList)}
                    maxCount={1}
                  >
                    <UploadButton />
                  </Upload>
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: open,
                      onVisibleChange: (visible) => {
                        if (!visible) handleClosePreview();
                      },
                      src: imgUrl,
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Form Actions */}
            <Form.Item
              style={{ textAlign: "right", marginBottom: 0, }}
            >
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
          scroll={{ x: 1200 }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          columns={[
            {
              title: "ឈ្មោះផលិតផល",
              dataIndex: "product_name",
              key: "product_name",
              fixed: "left",
              width: 200,
            },
            {
              title: "ប្រភេទ",
              dataIndex: "category",
              key: "category",
              render: (category) => category?.name,
            },
            {
              title: "ម៉ាក/Brand",
              dataIndex: "brand",
              key: "brand",
              render: (brand) => brand?.name,
            },
            {
              title: "តម្លៃ",
              dataIndex: "price",
              key: "price",
              align: "right",
              render: (price) => (
                <span style={{ fontWeight: "500", color: "#1677ff" }}>
                  $
                  {Number(price).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              ),
            },
            {
              title: "ចំនួន",
              dataIndex: "quantity",
              key: "quantity",
              align: "center",
              render: (qty) => (
                <span
                  style={{
                    color: qty <= 5 ? "red" : "inherit",
                    fontWeight: qty <= 5 ? "bold" : "normal",
                  }}
                >
                  {qty}
                </span>
              ),
            },
            {
              title: "រូបភាព",
              dataIndex: "image",
              key: "image",
              align: "center",
              render: (image) =>
                image ? (
                  <Image
                    src={config.image_path + image}
                    width={80}
                    height={50}
                    style={{
                      borderRadius: "4px",
                      objectFit: "cover",
                      border: "1px solid #f0f0f0",
                    }}
                  />
                ) : (
                  <div style={{ color: "#ccc", fontSize: "12px" }}>
                    គ្មានរូបភាព
                  </div>
                ),
            },
            {
              title: "ស្ថានភាព",
              dataIndex: "status",
              key: "status",
              align: "center",
              render: (value) => {
                const isActive = value === "active" || value === 1;
                return (
                  <Tag
                    color={isActive ? "green" : "red"}
                    style={{ borderRadius: "10px", padding: "0 10px" }}
                  >
                    {isActive ? "សកម្ម" : "អសកម្ម"}
                  </Tag>
                );
              },
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
              fixed: "right",
              width: 120,
              render: (data) => (
                <Space size="middle">
                  <Button
                    type="text"
                    onClick={() => handleEdit(data)}
                    icon={<CiEdit style={{ fontSize: 20, color: "#004EBC" }} />}
                  />
                  <Button
                    type="text"
                    danger
                    onClick={() => handleDelete(data)}
                    icon={<MdDelete style={{ fontSize: 20 }} />}
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

export default ProductPage;
