"use client"
import { Carousel, Menu, Card, Row, Col, Button, Input, Badge, notification } from 'antd';
import { useState, useEffect } from 'react';
import { SearchOutlined, PlayCircleOutlined, HeartOutlined } from '@ant-design/icons';
import Link from 'next/link';
import styles from "./page.module.css";
import logo from "../../assets/homePage/logo.png"
import carousel1 from "../../assets/homePage/carousel1.png"
import carousel2 from "../../assets/homePage/carousel2.png"
import carousel3 from "../../assets/homePage/carousel3.png"
import course1 from "../../assets/homePage/course1.png"
import course2 from "../../assets/homePage/course2.png"
import course3 from "../../assets/homePage/course3.png"
import course4 from "../../assets/homePage/course4.webp"
import course5 from "../../assets/homePage/course5.webp"
import Image from 'next/image';
import Footer from '../components/footer/page';

const HomePage = () => {
  // 主页状态
  const [courses, setCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [newCourses, setNewCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [current, setCurrent] = useState('course');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  // 模拟课程数据
  useEffect(() => {
    // 模拟API请求，初始化课程数据
    setCourses([
      { id: 1, title: 'React 初学者课程', category: '前端', students: 300, updatedAt: '2024-12-12' },
      { id: 2, title: 'Node.js 高级课程', category: '后端', students: 150, updatedAt: '2024-12-10' },
      { id: 3, title: 'JavaScript 进阶', category: '前端', students: 500, updatedAt: '2024-12-11' }
    ]);
    setRecommendedCourses([ /* 推荐课程 */]);
    setNewCourses([ /* 最新课程 */]);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCourseClick = (courseId) => {
    // 导航至课程详情页面
    window.location.href = `/courses/${courseId}`;
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
    <div className={styles.container}>
      {/* 页首导航 */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image className={styles.logoIcon} src={logo} alt="Logo" />
          在线教育平台
        </div>
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{ width: '390px', fontSize: '16px' }} />
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

      <div className={styles.banner}>
        <div className={styles.leftContent}>

        </div>
        <div className={styles.carousel}>
          <Carousel autoplay>
            <div>
              <Image className={styles.carouselImage} src={carousel1} alt="carousel1" />
            </div>
            <div>
              <Image className={styles.carouselImage} src={carousel2} alt="carousel1" />
            </div>
            <div>
              <Image className={styles.carouselImage} src={carousel3} alt="carousel1" />
            </div>
          </Carousel>
        </div>
        <div className={styles.rightContent}>

        </div>

      </div>


      {/* 推荐课程 */}
      <div className={styles.recommendedCoursesTitle}>
        <h2>推荐课程</h2>
      </div>
      <div className={styles.recommendedCoursesList}>
        <div className={styles.recommendedCoursesItem}>
          <Image className={styles.courseImage} src={course1} alt="course" />
          <div className={styles.courseName}>
            庄子精讲
          </div>
          <div className={styles.courseSchool}>
            深圳大学
          </div>
          <div className={styles.courseAuthor}>
            王阳明
          </div>
        </div>
        <div className={styles.recommendedCoursesItem}>
          <Image className={styles.courseImage} src={course2} alt="course" />
          <div className={styles.courseName}>
            音乐与健康
          </div>
          <div className={styles.courseSchool}>
            深圳大学
          </div>
          <div className={styles.courseAuthor}>
            王阳明
          </div>

        </div>
        <div className={styles.recommendedCoursesItem}>
          <Image className={styles.courseImage} src={course3} alt="course" />
          <div className={styles.courseName}>
            谈判技巧
          </div>
          <div className={styles.courseSchool}>
            深圳大学
          </div>
          <div className={styles.courseAuthor}>
            王阳明
          </div>
        </div>
        <div className={styles.recommendedCoursesItem}>
          <Image className={styles.courseImage} src={course4} alt="course" />
          <div className={styles.courseName}>
            数字电路
          </div>
          <div className={styles.courseSchool}>
            深圳大学
          </div>
          <div className={styles.courseAuthor}>
            王阳明
          </div>
        </div>
        <div className={styles.recommendedCoursesItem}>
          <Image className={styles.courseImage} src={course5} alt="course" />
          <div className={styles.courseName}>
            线性代数
          </div>
          <div className={styles.courseSchool}>
            深圳大学
          </div>
          <div className={styles.courseAuthor}>
            王阳明
          </div>
        </div>
        <div className={styles.recommendedCoursesItem}>

        </div>
        <div className={styles.recommendedCoursesItem}>

        </div>
        <div className={styles.recommendedCoursesItem}>

        </div>
      </div>

      {/* 推荐课程 */}
      <div className={styles.recommendedCoursesTitle}>
        <h2>热门课程</h2>
      </div>
      <div className={styles.recommendedCoursesList}>
        <div className={styles.recommendedCoursesItem}>
          <Image className={styles.courseImage} src={course1} alt="course" />
          <div className={styles.courseName}>
            庄子精讲
          </div>
          <div className={styles.courseSchool}>
            深圳大学
          </div>
          <div className={styles.courseAuthor}>
            王阳明
          </div>
        </div>
        <div className={styles.recommendedCoursesItem}>
          <Image className={styles.courseImage} src={course2} alt="course" />
          <div className={styles.courseName}>
            音乐与健康
          </div>
          <div className={styles.courseSchool}>
            深圳大学
          </div>
          <div className={styles.courseAuthor}>
            王阳明
          </div>

        </div>
        <div className={styles.recommendedCoursesItem}>
          <Image className={styles.courseImage} src={course3} alt="course" />
          <div className={styles.courseName}>
            谈判技巧
          </div>
          <div className={styles.courseSchool}>
            深圳大学
          </div>
          <div className={styles.courseAuthor}>
            王阳明
          </div>
        </div>
        <div className={styles.recommendedCoursesItem}>
          <Image className={styles.courseImage} src={course4} alt="course" />
          <div className={styles.courseName}>
            数字电路
          </div>
          <div className={styles.courseSchool}>
            深圳大学
          </div>
          <div className={styles.courseAuthor}>
            王阳明
          </div>
        </div>
        <div className={styles.recommendedCoursesItem}>
          <Image className={styles.courseImage} src={course5} alt="course" />
          <div className={styles.courseName}>
            线性代数
          </div>
          <div className={styles.courseSchool}>
            深圳大学
          </div>
          <div className={styles.courseAuthor}>
            王阳明
          </div>
        </div>
        <div className={styles.recommendedCoursesItem}>

        </div>
        <div className={styles.recommendedCoursesItem}>

        </div>
        <div className={styles.recommendedCoursesItem}>

        </div>
      </div>




      {/* 页脚 */}
      <div className={styles.footer}>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default HomePage;
