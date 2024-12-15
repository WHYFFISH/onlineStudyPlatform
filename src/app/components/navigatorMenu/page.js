
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
      key: 'course',
      label: (
        <a href="#" target="_blank" rel="noopener noreferrer">
          课程
        </a>
      ),
    },
    {
      key: 'school',
      label: (
        <a href="#" target="_blank" rel="noopener noreferrer">
          学校
        </a>
      ),
    },
    {
      key: 'teacher',
      label: '教师'
    },
    {
      key: 'alipay',
      label: (
        <a href="#" target="_blank" rel="noopener noreferrer">
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