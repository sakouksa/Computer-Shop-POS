import React, { useState } from "react";
import { App, Button, Checkbox, Flex, Form, Input, Spin } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { profileStore } from "../../store/profileStore";
import { request } from "../../utils/request";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setProfile, setAccessToken, setPermission } = profileStore();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const onFinish = async (values) => {
    const param = {
      email: values.username,
      password: values.password,
    };
    setLoading(true);
    const res = await request("login", "post", param);
    setLoading(false);
    if (res && !res.error) {
      setProfile({
        ...res.user?.profile,
        ...res.user,
      });
      setPermission(res.permission);
      setAccessToken(res.access_token);
      message.success(res.message || "Welcome back!");
      navigate("/");
    } else {
      const errorMsg = res?.errors?.message || "Invalid email or password!";
      message.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-10 shadow-sm border border-gray-200 rounded-xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Sign In</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Access your POS Dashboard
            </p>
          </div>

          <Spin spinning={loading}>
            <Form 
              name="login" 
              onFinish={onFinish} 
              layout="vertical" 
              requiredMark={false}
              size="large"
            >
              <Form.Item
                name="username"
                label={<span className="text-gray-700 font-medium">Email Address</span>}
                rules={[{ required: true, message: "Please enter your email!" }]}
              >
                <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="admin@example.com" />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="text-gray-700 font-medium">Password</span>}
                rules={[{ required: true, message: "Please enter your password!" }]}
              >
                <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
              </Form.Item>

              <div className="flex items-center justify-between mb-6">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-sm text-gray-600">Remember me</Checkbox>
                </Form.Item>
                <Link to="/forgot-password" size="small" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>

              <Form.Item className="mb-0">
                <Button block type="primary" htmlType="submit" loading={loading} className="h-11 font-semibold">
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </Spin>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;