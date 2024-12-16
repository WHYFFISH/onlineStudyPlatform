"use client";

import React, { useState } from "react";
import { Form, Input, Button, Select, Checkbox, Typography, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useRouter } from "next/navigation"; // 导入路由跳转功能
import bcrypt from "bcryptjs";
import { mockUsers, failedAttempts } from "../../mockData";
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

    const onFinish = (values) => {
        setLoading(true);

        const ip = getIpAddress();
        const deviceId = getDeviceId();

        // 检查 IP 和设备号是否已被冻结
        if (failedAttempts.ip[ip] >= MAX_ATTEMPTS) {
            alert("当前IP已被冻结，请稍后再试");
            setLoading(false);
            return;
        }

        if (failedAttempts.device[deviceId] >= MAX_ATTEMPTS) {
            alert("当前设备已被冻结，请稍后再试");
            setLoading(false);
            return;
        }

        // 查找用户数据
        const users = mockUsers[role];
        const user = users.find((u) => u.username === values.username);

        if (!user) {
            alert("账号不存在！");
            setLoading(false);
            return;
        }

        // 验证密码
        if (bcrypt.compareSync(values.password, user.password)) {
            alert(`${role} 登录成功！`);

            // 保存账号到 localStorage
            if (values.remember) {
                localStorage.setItem("rememberedAccount", values.username);
            } else {
                localStorage.removeItem("rememberedAccount");
            }

            // 清除失败记录
            failedAttempts.ip[ip] = 0;
            failedAttempts.device[deviceId] = 0;

            // 跳转到主页
            router.push("/homePage");
        } else {
            // 更新失败记录
            failedAttempts.ip[ip] = (failedAttempts.ip[ip] || 0) + 1;
            failedAttempts.device[deviceId] = (failedAttempts.device[deviceId] || 0) + 1;

            alert(
                `密码错误！还有 ${MAX_ATTEMPTS - failedAttempts.ip[ip]} 次尝试机会`
            );

            // 冻结账号或IP地址
            if (failedAttempts.ip[ip] >= MAX_ATTEMPTS) {
                alert("账号或IP地址已被冻结，请稍后再试");
            }
        }

        setLoading(false);
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
                        username: localStorage.getItem("rememberedAccount") || "", // 自动填充记住的账号
                        remember: true, // 默认勾选记住账号
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
                            <Option value="student">学生</Option>
                            <Option value="teacher">教师</Option>
                            <Option value="admin">系统管理员</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="账号"
                        name="username"
                        rules={[{ required: true, message: "请输入账号" }]}
                    >
                        <Input placeholder="请输入账号" />
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
                            <Checkbox>记住账号</Checkbox>
                        </Form.Item>
                        <a href="/forgot-password" className={styles.link}>
                            忘记密码？
                        </a>
                    </div>
                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
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
