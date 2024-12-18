
"use client"
import { Select, Carousel, Menu, Card, Row, Col, Button, Input, Badge, notification, List, Divider } from 'antd';
import React, { useState, useEffect } from 'react';
const NavigatorMenu = ({ initialCurrent }) => {
  const [current, setCurrent] = useState(initialCurrent);
  const [userRole, setUserRole] = React.useState('student');
  const [userName, setUserName] = React.useState('');

  // 在组件挂载时检查 localStorage
  React.useEffect(() => {
    // 获取 localStorage 中的 userId
    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('rememberedAccount');

    // 如果 userId 存在，表示用户已登录
    if (userRole) {
      setUserRole(userRole);
      setUserName(userName);
    }
  }, []); // 空数组，表示只在组件挂载时执行一次

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  // 根据 userRole 动态设置个人主页的链接
  const personalLink = !userRole ? '/auth/login' : userRole === 'student' ? '/student' : '/teacher';

  const items = [
    {
      key: 'home',
      label: (
        <a href="/homePage" rel="noopener noreferrer">
          首页
        </a>
      ),
    },
    {
      key: 'course',
      label: (
        <a href="/searchPage" rel="noopener noreferrer">
          课程
        </a>
      ),
    },
    {
      key: 'personal',
      label: (
        <a href={personalLink} rel="noopener noreferrer">
          个人主页
        </a>
      ),
    },
    {
      key: 'about',
      label: (
        <a href="#" rel="noopener noreferrer">
          关于我们
        </a>
      ),
    },
  ];
  return (
    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{ width: '390px', fontSize: '16px' }} />
  )
}

export default NavigatorMenu;