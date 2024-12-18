"use client"
import { Select, Carousel, Menu, Card, Row, Col, Button, Input, Badge, notification, List, Divider, message } from 'antd';
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
  const { courseId } = useParams();
  console.log(courseId)
  // 定义状态来控制选中的菜单项
  const [selectedMenuItem, setSelectedMenuItem] = useState('intro'); // 默认选中“课程简介”
  const [searchTerm, setSearchTerm] = useState('');

  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
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
    // 仅在 userRole 为 'student' 时显示
    ...(userRole === 'student'
      ? [
        {
          key: 'personalNotes',
          label: '个人笔记',
        },
        {
          type: 'divider',
        },
      ]
      : []),
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

  // 在组件挂载时检查 localStorage
  useEffect(() => {
    // 获取 localStorage 中的 userId
    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('rememberedAccount');

    // 如果 userId 存在，表示用户已登录
    if (userRole) {
      setUserRole(userRole);
      setUserName(userName);
    }
  }, []); // 空数组，表示只在组件挂载时执行一次

  const fetchCourse = async () => {
    if (!courseId) return;
    setLoading(true);
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        headers: {
          'userId': userId
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourse(data);
      console.log(data);
    } catch (err) {
      message.error('Failed to fetch course');
    } finally {
      setLoading(false);
    }
  };
  // 在组件挂载时调用接口
  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const onClickMenu = (e) => {
    setSelectedMenuItem(e.key);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 点击事件处理，跳转到登录页面
  const handleLoginClick = () => {
    router.push("/auth/login");
  };

  // 点击事件处理，跳转到注册页面
  const handleRegisterClick = () => {
    router.push("/auth/register");
  };

  // 回车事件处理，触发页面跳转
  const handlePressEnter = () => {
    if (searchTerm.trim()) {
      router.push(`/searchPage?keyword=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  // 根据选中的菜单项来显示不同的内容
  const menuContent = () => {
    switch (selectedMenuItem) {
      case 'intro':
        return (<p className={styles.courseInfo}>
          {course.description}这门数字集成电路课程内容丰富，涵盖了Chisel开发环境的搭建、LC-3处理器各模块的设计与实现，以及在FPGA平台上的应用。通过10个实验，从基础知识回顾到实际操作，学生可以深入了解数字电路设计的各个方面。课程的设计报告要求详细，涵盖了需求分析、设计方案、实现过程、测试结果等内容，旨在考察学生的设计思路、技术实现和文档编写能力。实验不仅注重功能实现的正确性和性能，还强调文档质量和展示表现，充分锻炼了学生在工程实践中的综合能力。通过课程的学习，学生能够将理论知识与实际项目结合，提升解决复杂问题的能力。
        </p>);
      case 'menu':
        return <CourseMenu />;
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

  // 注册课程的处理函数
  const handleJoinCourse = async () => {
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ courseId: courseId }), // 发送课程ID
        // TODO：从session获取用户ID ID存在localStorage.setItem("userId", data.user.id);
        body: JSON.stringify({ userId: localStorage.getItem("userId"), courseId: courseId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || '注册课程失败'); // 使用 alert 显示错误信息
        return;
      }

      alert('注册成功'); // 使用 alert 显示成功信息
      window.location.reload();
    } catch (error) {
      console.error('注册课程时发生错误:', error);
      alert('注册课程失败'); // 使用 alert 显示错误信息
    }
  };

  return (
    <div className={styles.container}>
      {/* 页首导航 */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image className={styles.logoIcon} src={logo} alt="Logo" priority/>
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
            onPressEnter={handlePressEnter} // 监听回车事件
          />
          <Button type="primary" onClick={handleLoginClick}>登录</Button>
          <Button onClick={handleRegisterClick} style={{ marginLeft: 10 }}>注册</Button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.carousel}>
          <Carousel autoplay>
            <div>
              <Image className={styles.carouselImage} src={course1} alt="carousel1" priority/>
            </div>
            <div>
              <Image className={styles.carouselImage} src={course2} alt="carousel1" priority/>
            </div>
            <div>
              <Image className={styles.carouselImage} src={course3} alt="carousel1" priority/>
            </div>
          </Carousel>
        </div>
        <div className={styles.details}>
          <h2 className={styles.courseTitle}>{course.title}</h2>
          <p className={styles.courseSubtitle}>music and health</p>

          <div className={styles.courseTag}>
            国家线上一流课程
          </div>

          <div className={styles.courseSchool}>
            <strong>{course.schoolPanel ? course.schoolPanel.name : '深圳大学'}</strong> /
            {course.teachers && course.teachers.length > 0 ? course.teachers[0].name : '未知教师'}
          </div>

          <div className={styles.courseStats}>
            <div className={styles.statItem}>
              <p className={styles.statLabel}>开课语种</p>
              <p className={styles.statValue}>中文</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.statLabel}>开课次数</p>
              <p className={styles.statValue}>{course.likes}次</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.statLabel}>累计选课</p>
              <p className={styles.statValue}>{course.registration_count}人</p>
            </div>
          </div>

          <div className={styles.courseTerm}>
            选择周期：
            <select className={styles.termSelect}>
              <option>【MOOC学分课】2024年秋季学期</option>
            </select>
          </div>
          {/* TODO：从session获取用户ID并判断是否已经注册该课程 */}

          {userRole == 'student' ? (
            <Button className={styles.joinButton} onClick={handleJoinCourse}>加入课程</Button>
          ) : (<Button className={styles.joinButton} onClick={handleJoinCourse} disabled>加入课程</Button>)
          }


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
      <div className={styles.footer}>
        <Footer></Footer>
      </div>

    </div>
  );
};

export default CoursePage;
