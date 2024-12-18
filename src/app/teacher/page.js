"use client";

import React, { useState, useEffect } from "react";
import CourseList from "./components/CourseList";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import whyAvatar from "../../assets/homePage/avatar.jpg"
import Image from "next/image";
import Link from 'next/link';
import { getAllCourses } from "../teacher/utils/indexDB";
import NavigatorMenu from "../components/navigatorMenu/page";
import Footer from "../components/footer/page";
import logo from "../../assets/homePage/logo.png"
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Container,
  Grid,
  Card,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CssBaseline,
  Divider,
  CardMedia,
  CardContent,
  Button,
  MenuItem,
  Menu,
  Input,
} from '@mui/material';

const menuItems = [
  { key: 'courses', label: '我的课程', icon: '🎓' },
  { key: 'discussion', label: '讨论专区', icon: '💬' },
  { key: 'assignments', label: '作业管理', icon: '📝' },
];


export default function TeacherDetailsPage() {
  const router = useRouter();
  const [discussions, setDiscussions] = useState([]);

  // 示例教师信息
  const teacherInfo = {
    avatar: "C:\Users\MI\onlineStudyPlatform\src\assets", // 头像路径
    name: "王晗瑜老师",
    bio: "多年教学经验，擅长多媒体技术与课程设计。",
    // courses: [
    //   { id: 1, title: "Web开发基础", description: "学习HTML、CSS、JavaScript的基础知识。" },
    //   { id: 2, title: "React进阶", description: "掌握React Hooks、状态管理与性能优化。" },
    // ],
  };

  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [Ncourses, setNCourses] = useState([]);

  const fetchDiscussions = async () => {
    try {
      const response = await fetch('/api/discussions/recent');
      if (!response.ok) {
        throw new Error('获取讨论失败');
      }
      const data = await response.json();
      setDiscussions(data.discussions || []);
    } catch (err) {
      console.error('获取讨论失败:', err);
      setDiscussions([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks/pending');
      if (!response.ok) {
        throw new Error('获取任务失败');
      }
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error('获取任务失败:', err);
      setTasks([]);
    }
  };

  useEffect(() => {

    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses"); // 替换为后端 API 地址
        if (!response.ok) {
          throw new Error("课程数据获取失败");
        }
        const data = await response.json(); // 解析 JSON 数据
        setCourses(data); // 设置课程数据
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchNCourses = async () => {
      const data = await getAllCourses();
      setNCourses(data); // 更新课程状态
    };

    fetchCourses();
    fetchNCourses();
    fetchDiscussions();
  }, []);

  const goToCoursewareUpload = (courses) => {
    router.push(`/teacher/upload?=${courses.id}`);
  };

  const goToHomeworkPublish = (courseId) => {
    router.push(`/teacher/homework?courseId=${courseId}`);
  };

  const goToPicPublish = (courseId) => {
    router.push(`/teacher/uploadPic?courseId=${courseId}`);
  };
  const goToUpdateInfo = (courseId) => {
    const courseData = { id: courseId, name: "CourseId" };
    router.push(`/teacher/updateInfo?id=${courseId}`)
  };


  const redirectToCoursePage = () => {
    router.push(`/teacher/PublishClass`);
  }
  const ContentComponents = {

    courses: <div className={styles.content}>
      <div className={styles.courses}>
        <h2>我的课程</h2>
        <CourseList
          courses={Ncourses}
          onUploadClick={goToCoursewareUpload}
          onHomeworkClick={goToHomeworkPublish}
          onPickClick={goToPicPublish}
          onUpdateClick={goToUpdateInfo}
        />
        <CourseList
          courses={courses}
          onUploadClick={goToCoursewareUpload}
          onHomeworkClick={goToHomeworkPublish}
          onPickClick={goToPicPublish}
          onUpdateClick={goToUpdateInfo}
        />
      </div>
      <Link href="teacher/PublishClass">
        <button className={styles.actionButton}>发布课程</button>
      </Link>
    </div>,
    discussion: (
      <div className={styles.content}>
        {discussions.map((discussion, index) => (
          <Box
            key={`discussion-${discussion.id}-${index}`}
            sx={{
              p: 2,
              "&:not(:last-child)": {
                borderBottom: "1px solid",
                borderColor: "divider",
              },
            }}
          >
            {/* 顶部部分：头像、标题、作者和时间 */}
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
              <Avatar
                src={discussion.author_avatar || "/default-avatar.png"} // 默认头像
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {discussion.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {discussion.author_name} · {discussion.course_name} ·{" "}
                  {new Date(discussion.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            {/* 讨论内容 */}
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                display: "-webkit-box",
                WebkitLineClamp: 2, // 限制内容显示两行
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {discussion.content}
            </Typography>

            {/* 底部：回复数量与详情按钮 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {discussion.reply_count} 回复
              </Typography>
              <Button
                size="small"
                onClick={() => router.push(`/student/discussion/${discussion.id}`)}
              >
                查看详情
              </Button>
            </Box>
          </Box>
        ))}
      </div>
    ),
    assignments: <div className={styles.content}>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>作业名称</TableCell>
            <TableCell>课程</TableCell>
            <TableCell align="right">截止日期</TableCell>
            <TableCell align="right">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.filter(task => !task.completed).map((task, index) => (
            <TableRow key={`pending-${task.id}-${index}`}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.courseName}</TableCell>
              <TableCell align="right">
                {new Date(task.deadline).toLocaleDateString()}
              </TableCell>
              <TableCell align="right">
                {new Date(task.deadline) > new Date() ? (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => router.push(`/teacher/assignment/${task.id}`)}
                  >
                    查看
                  </Button>
                ) : (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ fontStyle: 'italic' }}
                  >
                    已过期
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
          {tasks.filter(task => !task.completed).length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                暂无发布作业
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>



    </div>,
  };

  const [activeKey, setActiveKey] = useState('courses');
  return (
    <div class>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image className={styles.logoIcon} src={logo} alt="Logo" />
          在线教育平台
        </div>
        {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{ width: '390px', fontSize: '16px' }} /> */}
        <NavigatorMenu initialCurrent={'personal'} />
        <div style={{ display: 'flex', alignItems: 'center' }}>

        </div>
      </div>

      <div className={styles.profile}>
        <Image
          src={whyAvatar}
          alt="教师头像" git
          className={styles.avatar}
        />
        <div className={styles.info}>
          <h1>{teacherInfo.name}</h1>
          <p>{teacherInfo.bio}</p>
        </div>


      </div>
      <div className={styles.teacherDetails}>

        <div className={styles.container}>
          {/* 左侧菜单 */}
          <div className={styles.sidebar}>
            <h3>学习工具</h3>
            <ul>
              {menuItems.map((item) => (
                <li
                  key={item.key}
                  className={activeKey === item.key ? styles.active : ''}
                  onClick={() => setActiveKey(item.key)}
                >
                  {item.icon} {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* 右侧内容区域 */}
          <div className={styles.mainContent}>
            {ContentComponents[activeKey]}
          </div>
        </div>



        {/* <div className={styles.courses}>
          <h2>我的课程</h2>
          <CourseList
            courses={courses}
            onUploadClick={goToCoursewareUpload}
            onHomeworkClick={goToHomeworkPublish}
          />
        </div>
        <Link href="teacher/PublishClass">
          <button className={styles.actionButton}>发布课程</button>
        </Link> */}

      </div> <Footer />
    </div>

  );
}
