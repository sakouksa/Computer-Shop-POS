import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input } from "antd";
import { useNavigate } from "react-router-dom"; // បន្ថែមការ import នេះ
import { profileStore } from "../../store/profileStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setProfile } = profileStore();

  const onFinish = (values) => {
    console.log("Success:", values);

    let isSuccess = true;

    if (isSuccess) {
      const profile = {
        id: 1,
        name: "សាក់ ឧស្សាហ៍",
        email: values.username,
        role: "IT Manager",
      };

      setProfile(profile);
      navigate("/");
    }
  };

  return (
    <div
      style={{
        width: 400,
        padding: 25,
        margin: "100px auto",
        border: "1px solid #d9d9d9",
        backgroundColor: "#fff",
        borderRadius: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>Login</h1>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Username"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="/forgot-password">Forgot password</a>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" size="large">
            Log in
          </Button>
          <div style={{ marginTop: 10, textAlign: "center" }}>
            or <a href="/register">Register now!</a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
