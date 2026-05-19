import React, { useState } from "react";
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Upload, Image } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../../utils/request";

const { TextArea } = Input;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const RegisterPage = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [errors, setErrors] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList.slice(-1));

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("password_confirmation", values.password_confirmation);

    const rawPhone = values.phone || "";
    const cleanPhone = rawPhone.startsWith("0") ? rawPhone.substring(1) : rawPhone;
    const fullPhone = values.phone ? `+855${cleanPhone}` : "";

    formData.append("phone", fullPhone);
    formData.append("address", values.address || "");
    formData.append("type", "customer");

    if (fileList.length > 0) {
      formData.append("image", fileList[0].originFileObj);
    }

    const res = await request("register", "post", formData);
    if (res && !res.error) {
      message.success(res.message || "Registration successful!");
      navigate("/login");
    } else {
      setErrors(res.errors || {});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-10 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-10 shadow-sm border border-gray-200 rounded-xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-1 text-sm text-gray-500">Join our POS system today</p>
          </div>

          <Form name="register" onFinish={onFinish} layout="vertical" size="large" requiredMark={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="John Doe" />
              </Form.Item>

              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]} {...errors?.email}>
                <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="john@example.com" />
              </Form.Item>
            </div>

            <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
              <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="12 345 678" />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item name="password" label="Password" rules={[{ required: true }]} {...errors?.password}>
                <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
              </Form.Item>

              <Form.Item name="password_confirmation" label="Confirm Password" rules={[{ required: true }]} {...errors?.password_confirmation}>
                <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
              </Form.Item>
            </div>

            <Form.Item name="address" label="Address">
              <TextArea rows={2} placeholder="Building, Street, City..." maxLength={200} showCount />
            </Form.Item>

            <Form.Item label="Profile Picture" className="mb-6">
              <Upload
                customRequest={({ onSuccess }) => onSuccess("ok")}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div className="mt-1 text-xs">Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Button block type="primary" htmlType="submit" className="h-11 font-semibold">
              Register Now
            </Button>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Sign In
              </Link>
            </div>
          </Form>
        </div>
      </div>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default RegisterPage;