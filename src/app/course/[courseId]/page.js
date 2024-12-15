"use client"
import { Select, Carousel, Menu, Card, Row, Col, Button, Input, Badge, notification, List, Divider } from 'antd';
import { useState, useEffect } from 'react';
import { SearchOutlined, PlayCircleOutlined, HeartOutlined } from '@ant-design/icons';
import Link from 'next/link';
import styles from "./page.module.css";
import logo from "../../../assets/homePage/logo.png"
import course1 from "../../../assets/homePage/course1.png"
import course2 from "../../../assets/homePage/course2.png"
import course3 from "../../../assets/homePage/course3.png"
import Image from 'next/image';
import Footer from '../../components/footer/page';
import { useRouter, useParams } from 'next/navigation'
import { FacebookOutlined, TwitterOutlined, LinkedinOutlined, GithubOutlined } from '@ant-design/icons';
import NavigatorMenu from '../../components/navigatorMenu/page';


const CoursePage = () => {
  const menuItems = [
    {
      key: 'sub1',
      label: 'Navigation One',
      // icon: <MailOutlined />,
      children: [
        {
          key: 'g1',
          label: 'Item 1',
          type: 'group',
          children: [
            {
              key: '1',
              label: 'Option 1',
            },
            {
              key: '2',
              label: 'Option 2',
            },
          ],
        },
        {
          key: 'g2',
          label: 'Item 2',
          type: 'group',
          children: [
            {
              key: '3',
              label: 'Option 3',
            },
            {
              key: '4',
              label: 'Option 4',
            },
          ],
        },
      ],
    },
    {
      key: 'sub2',
      label: 'Navigation Two',
      // icon: <AppstoreOutlined />,
      children: [
        {
          key: '5',
          label: 'Option 5',
        },
        {
          key: '6',
          label: 'Option 6',
        },
        {
          key: 'sub3',
          label: 'Submenu',
          children: [
            {
              key: '7',
              label: 'Option 7',
            },
            {
              key: '8',
              label: 'Option 8',
            },
          ],
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: 'sub4',
      label: 'Navigation Three',
      // icon: <SettingOutlined />,
      children: [
        {
          key: '9',
          label: 'Option 9',
        },
        {
          key: '10',
          label: 'Option 10',
        },
        {
          key: '11',
          label: 'Option 11',
        },
        {
          key: '12',
          label: 'Option 12',
        },
      ],
    },
    {
      key: 'grp',
      label: 'Group',
      type: 'group',
      children: [
        {
          key: '13',
          label: 'Option 13',
        },
        {
          key: '14',
          label: 'Option 14',
        },
      ],
    },
  ];
  const socialMediaStyle = {
    display: 'flex',
    gap: '10px',
  };

  const iconStyle = {
    fontSize: '24px',
    color: '#555',
    '&:hover': {
      color: 'rgb(229, 90, 0)',  // 添加hover效果
    },
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
  const { courseId } = useParams();
  console.log(courseId)
  const [current, setCurrent] = useState('course');
  const [searchTerm, setSearchTerm] = useState('');

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  return (
    <div className={styles.container}>
      {/* 页首导航 */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image className={styles.logoIcon} src={logo} alt="Logo" />
          在线教育平台
        </div>
        <NavigatorMenu initialCurrent={'school'} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索课程"
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: 260, marginRight: '60px' }}
          />
          <Button type="primary">登录</Button>
          <Button style={{ marginLeft: 10 }}>注册</Button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.carousel}>
          <Carousel autoplay>
            <div>
              <Image className={styles.carouselImage} src={course1} alt="carousel1" />
            </div>
            <div>
              <Image className={styles.carouselImage} src={course2} alt="carousel1" />
            </div>
            <div>
              <Image className={styles.carouselImage} src={course3} alt="carousel1" />
            </div>
          </Carousel>
        </div>
        <div className={styles.details}>
          <h2 className={styles.courseTitle}>音乐与健康</h2>
          <p className={styles.courseSubtitle}>music and health</p>

          <div className={styles.courseTag}>
            国家线上一流课程
          </div>

          <div className={styles.courseSchool}>
            <strong>宁波大学</strong> / 王蕾 (副教授)
          </div>

          <div className={styles.courseStats}>
            <div className={styles.statItem}>
              <p className={styles.statLabel}>开课语种</p>
              <p className={styles.statValue}>中文</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.statLabel}>开课次数</p>
              <p className={styles.statValue}>18次</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.statLabel}>累计选课</p>
              <p className={styles.statValue}>20920人</p>
            </div>
          </div>

          <div className={styles.courseTerm}>
            选择周期：
            <select className={styles.termSelect}>
              <option>【MOOC学分课】2024年秋季学期</option>
            </select>
          </div>

          <button className={styles.joinButton}>加入课程</button>


          <div className={styles.bottom}>
            <div className={styles.followInfo}>
              已关注：<span className={styles.followCount}>♥ 597人</span>
            </div>

            <div className={styles.shareIcons}>
              <span>分享：</span>
              <div style={socialMediaStyle}>
                <a href="https://facebook.com" style={iconStyle} target="_blank" rel="noopener noreferrer">
                  <FacebookOutlined />
                </a>
                <a href="https://twitter.com" style={iconStyle} target="_blank" rel="noopener noreferrer">
                  <TwitterOutlined />
                </a>
                <a href="https://linkedin.com" style={iconStyle} target="_blank" rel="noopener noreferrer">
                  <LinkedinOutlined />
                </a>
                <a href="https://github.com" style={iconStyle} target="_blank" rel="noopener noreferrer">
                  <GithubOutlined />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.courseDetail}>

      </div>


      {/* <div className={styles.footer}>
        <Footer></Footer>
      </div> */}
    </div>
  );
};

export default CoursePage;
