"use client";

import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Typography, Radio } from "antd";
import styles from "./page.module.css";

const { Title } = Typography;
import Script from 'next/script';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [isEmailVerification, setIsEmailVerification] = useState(false);
  const [isPhoneVerification, setIsPhoneVerification] = useState(false);
  const [registrationType, setRegistrationType] = useState("studentId"); // 默认选择学号注册
  const [validate, setValidate] = useState(false);

  const myCaptcha = React.useRef(null);

  const onSendCaptcha = () => {
    console.log("进入点击函数");
    if (myCaptcha.current) {
      console.log("展示图形验证码");
      myCaptcha.current.showCaptcha();
    }
  }


  const onFinish = async (values) => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username, // 账号
          password: values.password, // 密码
          email: values.email,       // 邮箱
          phone: values.phone,       // 手机号
          role: "student",           // 角色
        }),
      });

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem("userId", data.user.id); // 记住账号
        console.log("登录成功，用户ID:", data.user.id);
        localStorage.setItem("rememberedAccount", values.username); // 记住账号
        localStorage.setItem("role", data.user.role); // 记住角色
        alert("注册成功！");
        router.push("/homePage"); // 跳转到主页

      } else {
        alert(data.error || "注册失败，请稍后再试");
      }
    } catch (error) {
      console.error("注册请求失败:", error);
      alert("注册请求失败，请检查网络连接！");
    } finally {
      setLoading(false);
    }
  };


  // 初始化验证码函数
  const initCaptcha = () => {
    (window).initAlicom4({
      captchaId: "1b799ad8ff3386a687cf039e1f22d07a",
      product: 'bind',
      protocol: 'https://'
    }, function (captcha) {
      myCaptcha.current = captcha
      console.log("验证码实例初始化：", captcha);
      captcha.onSuccess(async function () {
        setValidate(true);
        alert("验证成功！")

      })
        .onError(function () {
          // message.error("验证出错！请稍后重试")
          alert("验证失败！")
        });
    })
  };




  const handleEmailVerification = () => {
    // 模拟发送邮箱验证码
    setIsEmailVerification(true);
    alert("验证码已发送到您的校内邮箱，请查收！");
  };

  const handlePhoneVerification = () => {
    // 模拟发送短信验证码
    setIsPhoneVerification(true);
    alert("验证码已发送到您的手机，请查收！");
  };

  return (
    <div className={styles.pageBackground}>
      <Script
        src="https://static.alicaptcha.com/v4/ct4.js"
        strategy="afterInteractive"
        onLoad={initCaptcha} // 脚本加载完成后调用 initCaptcha
      />
      <div className={styles.container}>
        <Title level={2} className={styles.title}>用户注册</Title>
        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          className={styles.form}
        >
          {/* 注册方式选择 */}
          <Form.Item label="选择注册方式" name="registrationType">
            <Radio.Group
              onChange={(e) => setRegistrationType(e.target.value)}
              defaultValue="studentId"
            >
              <Radio value="studentId">学号注册</Radio>
              <Radio value="email">校内邮箱注册</Radio>
            </Radio.Group>
          </Form.Item>

          {/* 学号注册 */}
          {registrationType === "studentId" && (
            <Form.Item
              label="学号"
              name="studentId"
              rules={[
                { required: true, message: "请输入学号" },
                { pattern: /^\d{8}$/, message: "学号格式应为8位数字" },
              ]}
            >
              <Input placeholder="请输入学号" />
            </Form.Item>
          )}

          {/* 校内邮箱注册 */}
          {registrationType === "email" && (
            <>
              <Form.Item
                label="校内邮箱"
                name="email"
                rules={[
                  { required: true, message: "请输入校内邮箱" },
                  { type: "email", message: "请输入有效的邮箱地址" },
                ]}
              >
                <Input placeholder="请输入校内邮箱" />
              </Form.Item>
            </>
          )}

          {/* 手机号注册 */}
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: "请输入手机号" },
              { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号" },
            ]}
          >
            <Input
              placeholder="请输入手机号"
              addonAfter={
                <Button
                  size="small"
                  type="link"
                  onClick={onSendCaptcha}
                >
                  发送验证码
                </Button>
              }
            />
          </Form.Item>

          <Form.Item
            label="短信验证码"
            name="phoneCode"
            rules={[
              { required: isPhoneVerification, message: "请输入短信验证码" },
            ]}
          >
            <Input placeholder="请输入短信验证码" />
          </Form.Item>

          {/* 账号输入 */}
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input placeholder="请输入账号" />
          </Form.Item>

          {/* 密码设置 */}
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              {
                pattern: /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message: "密码需至少8位，包含字母和数字",
              },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("两次输入的密码不一致！");
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>

          {/* 提交按钮 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              注册
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
