
"use client"
import { Select, Carousel, Menu, Card, Row, Col, Button, Input, Badge, notification, List, Divider } from 'antd';
import { useState, useEffect } from 'react';
const NavigatorMenu = ({ initialCurrent }) => {
  const [current, setCurrent] = useState(initialCurrent);
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

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
        <a href="/course"  rel="noopener noreferrer">
          课程
        </a>
      ),
    },
    {
      key: 'teacher',
      label: (
        <a href="/teacher"  rel="noopener noreferrer">
          教师
        </a>
      ),
    },
    {
      key: 'personal',
      label: (
        <a href="/student" rel="noopener noreferrer">
          个人
        </a>
      ),
    },
  ];
  return (
    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{ width: '390px', fontSize: '16px' }} />
  )
}

export default NavigatorMenu;