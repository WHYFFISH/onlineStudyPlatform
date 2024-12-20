"use client";

import React, { useState } from "react";
import { Form, Input, Button, Select, Checkbox, Typography, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useRouter } from "next/navigation"; // 导入路由跳转功能
import bcrypt from "bcryptjs";
import styles from "./page.module.css";
import "antd/dist/reset.css"; // Ant Design 样式


const { Title } = Typography;
const { Option } = Select;

const MAX_ATTEMPTS = 3;

const getIpAddress = () => "127.0.0.1"; // 模拟IP地址
const getDeviceId = () => localStorage.getItem("deviceId") || "device_001"; // 模拟设备号

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student"); // 默认角色
  const router = useRouter(); // 使用 Next.js 的路由跳转

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.name, // 用户名
          password: values.password, // 密码
          role: values.role,         // 登录角色
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 登录成功
        alert("登录成功！");
        localStorage.setItem("userId", data.user.id); // 记住用户名
        localStorage.setItem("name", values.name); // 记住用户名
        localStorage.setItem("role", data.user.role); // 记住角色
        router.push("/homePage"); // 跳转到主页
      } else {
        // 登录失败，提示错误信息
        alert(data.error || "登录失败，请稍后重试");
      }
    } catch (error) {
      console.error("登录请求失败:", error);
      alert("登录请求失败，请检查网络连接！");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        <Title level={2} className={styles.title}>用户登录</Title>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          method="post"
          initialValues={{
            name: localStorage.getItem("name") || "", // 自动填充记住的用户名
            remember: true, // 默认勾选记住用户名
            role: "student", // 默认角色
          }}
        >
          {/* 添加角色选择框 */}
          <Form.Item
            label="登录角色"
            name="role"
            rules={[{ required: true, message: "请选择登录角色" }]}
          >
            <Select
              placeholder="请选择角色"
              onChange={(value) => setRole(value)}
            >
              <Select.Option value="student">学生</Select.Option>
              <Select.Option value="teacher">教师</Select.Option>
              <Select.Option value="admin">系统管理员</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="用户名(姓名或手机号）"
            name="name"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              placeholder="请输入密码"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <div className={styles.options}>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>记住用户名</Checkbox>
            </Form.Item>
            <a href="/auth/register" className={styles.link}>
              注册/忘记密码？
            </a>
          </div>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            style={{ marginBottom: "25px", marginTop: "-30px" }}
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject("请同意隐私政策"),
              },
            ]}
          >
            <Checkbox>
              我已阅读并同意 <a href="/privacy-policy">《隐私政策》</a>
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
