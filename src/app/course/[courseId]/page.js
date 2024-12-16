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
import CourseMenu from '../../components/courseMenu/page';
import CourseDocument from '../../components/courseDocument/page';
import CommentSection from '../../components/commentSection/page';
import PersonalNotes from '../../components/personalNote/page';


const CoursePage = () => {
  const menuItems = [


    {
      key: 'intro',
      label: '课程简介',

    },
    {
      type: 'divider',
    },
    {
      key: 'menu',
      label: '课程目录',

    },
    {
      type: 'divider',
    },
    {
      key: 'document',
      label: '课程文档',

    },
    {
      type: 'divider',
    },
    {
      key: 'comment',
      label: '评论区',

    },
    {
      type: 'divider',
    },
    {
      key: 'personalNotes',
      label: '个人笔记',

    },
    {
      type: 'divider',
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
  const { courseId } = useParams();
  console.log(courseId)
  // 定义状态来控制选中的菜单项
  const [selectedMenuItem, setSelectedMenuItem] = useState('intro'); // 默认选中“课程简介”
  const [searchTerm, setSearchTerm] = useState('');

  const onClickMenu = (e) => {
    setSelectedMenuItem(e.key);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  // 根据选中的菜单项来显示不同的内容
  const menuContent = () => {
    switch (selectedMenuItem) {
      case 'intro':
        return (<p className={styles.courseInfo}>
          这门数字集成电路课程内容丰富，涵盖了Chisel开发环境的搭建、LC-3处理器各模块的设计与实现，以及在FPGA平台上的应用。通过10个实验，从基础知识回顾到实际操作，学生可以深入了解数字电路设计的各个方面。课程的设计报告要求详细，涵盖了需求分析、设计方案、实现过程、测试结果等内容，旨在考察学生的设计思路、技术实现和文档编写能力。实验不仅注重功能实现的正确性和性能，还强调文档质量和展示表现，充分锻炼了学生在工程实践中的综合能力。通过课程的学习，学生能够将理论知识与实际项目结合，提升解决复杂问题的能力。
        </p>);
      case 'menu':
        return <CourseMenu/>;
      case 'document':
        return <CourseDocument />;
      case 'comment':
        return <CommentSection />;
      case 'personalNotes':
        return <PersonalNotes />;
      default:
        return (<p className={styles.courseInfo}>
          这门数字集成电路课程内容丰富，涵盖了Chisel开发环境的搭建、LC-3处理器各模块的设计与实现，以及在FPGA平台上的应用。通过10个实验，从基础知识回顾到实际操作，学生可以深入了解数字电路设计的各个方面。课程的设计报告要求详细，涵盖了需求分析、设计方案、实现过程、测试结果等内容，旨在考察学生的设计思路、技术实现和文档编写能力。实验不仅注重功能实现的正确性和性能，还强调文档质量和展示表现，充分锻炼了学生在工程实践中的综合能力。通过课程的学习，学生能够将理论知识与实际项目结合，提升解决复杂问题的能力。
        </p>);
    }
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
        <div className={styles.menu}>
          <Menu
            onClick={onClickMenu}
            style={{
              width: 240,
              fontSize: '16px', // 设置菜单项字体大小
              height: '100%', // 设置菜单高度为100%
            }}
            defaultSelectedKeys={['intro']}
            mode="inline"
            items={menuItems}
          />
        </div>
        <div className={styles.courseContent}>
          {menuContent()}
        </div>
      </div>


    </div>
  );
};

export default CoursePage;
