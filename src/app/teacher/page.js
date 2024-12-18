"use client";

import React, {useState, useEffect} from "react";
import CourseList from "./components/CourseList";
import styles from "./page.module.css";
import {useRouter} from "next/navigation";
import whyAvatar from "../../assets/teacher/why.jpg"
import Image from "next/image";
import Link from 'next/link';
import {getAllCourses} from "../teacher/utils/indexDB";
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
    Checkbox,
} from '@mui/material';

// Mock 数据，包含50个学生信息
const mockStudents = Array.from({length: 50}, (_, i) => ({
    id: i + 1,
    name: `学生${i + 1}`,
    email: `student${i + 1}@example.com`,
    phone: `1380000${String(i + 1).padStart(4, "0")}`,
    status: i % 2 === 0 ? "active" : "suspended",
}));

const menuItems = [
    {key: 'courses', label: '我的课程', icon: '🎓'},
    {key: 'discussion', label: '讨论专区', icon: '💬'},
    {key: 'assignments', label: '作业管理', icon: '📝'},
];


export default function TeacherDetailsPage() {
    const router = useRouter();
    const [students, setStudents] = useState(mockStudents); // 存储学生列表数据
    const [selectedStudents, setSelectedStudents] = useState([]); // 批量选中状态
    const [activeKey, setActiveKey] = useState('courses');

    const toggleSelection = (id) => {
        setSelectedStudents((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const resetPassword = (id) => {
        alert(`学生ID: ${id} 的密码已重置为默认密码: "123456"`);
    };

    const toggleStatus = (id) => {
        setStudents((prev) =>
            prev.map((student) =>
                student.id === id
                    ? {...student, status: student.status === "active" ? "suspended" : "active"}
                    : student
            )
        );
    };

    const deleteStudent = (id) => {
        const confirmDelete = confirm(`确认要删除学生ID: ${id} 吗？此操作不可撤销。`);
        if (confirmDelete) {
            setStudents((prev) => prev.filter((student) => student.id !== id));
            alert(`学生ID: ${id} 已被删除。`);
        }
    };

    const deleteSelectedStudents = () => {
        if (selectedStudents.length === 0) return alert("请选择要删除的学生。");
        const confirmDelete = confirm(
            `确认要删除选中的 ${selectedStudents.length} 位学生吗？此操作不可撤销。`
        );
        if (confirmDelete) {
            setStudents((prev) => prev.filter((student) => !selectedStudents.includes(student.id)));
            setSelectedStudents([]);
            alert("选中学生已被删除。");
        }
    };
    const [discussions, setDiscussions] = useState([]);

    // 示例教师信息
    const teacherInfo = {
        avatar: whyAvatar, // 头像路径
        name: "王晗瑜老师",
        bio: "多年教学经验，擅长多媒体技术与课程设计。",
        // courses: [
        //   { id: 1, title: "Web开发基础", description: "学习HTML、CSS、JavaScript的基础知识。" },
        //   { id: 2, title: "React进阶", description: "掌握React Hooks、状态管理与性能优化。" },
        // ],
    };

    const [courses, setCourses] = useState([]);
    const [tasks, setTasks] = useState([]);

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


        fetchCourses();
        fetchDiscussions();
    }, []);

    const goToCoursewareUpload = (courses) => {
        router.push(`/teacher/upload?=${courses.id}`);
    };

    const goToHomeworkPublish = (courseId) => {
        router.push(`/teacher/homework?courseId=${courseId}`);
    };

    const redirectToCoursePage = () => {
        router.push(`/teacher/PublishClass`);
    }

    function StudentManagement({students}) {
        return (
            <div className={styles.content}>
                <h2>学生管理</h2>
                <Button
                    variant="contained"
                    color="error"
                    onClick={deleteSelectedStudents}
                    style={{marginBottom: "16px"}}
                >
                    批量删除
                </Button>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Checkbox
                                    checked={selectedStudents.length === students.length && students.length > 0}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setSelectedStudents(checked ? students.map((s) => s.id) : []);
                                    }}
                                />
                            </TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>姓名</TableCell>
                            <TableCell>邮箱</TableCell>
                            <TableCell>手机号</TableCell>
                            <TableCell>状态</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedStudents.includes(student.id)}
                                            onChange={() => toggleSelection(student.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{student.id}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>{student.phone}</TableCell>
                                    <TableCell>{student.status}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => resetPassword(student.id)}
                                        >
                                            重置密码
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color={student.status === "active" ? "secondary" : "success"}
                                            onClick={() => toggleStatus(student.id)}
                                            style={{marginLeft: "8px"}}
                                        >
                                            {student.status === "active" ? "禁用" : "启用"}
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="error"
                                            onClick={() => deleteStudent(student.id)}
                                            style={{marginLeft: "8px"}}
                                        >
                                            删除
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    暂无学生数据
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        );
    }


    const ContentComponents = {

        courses: <div className={styles.content}>
            <div className={styles.courses}>
                <h2>我的课程</h2>
                <CourseList
                    courses={courses}
                    onUploadClick={goToCoursewareUpload}
                    onHomeworkClick={goToHomeworkPublish}
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
                        <Box sx={{display: "flex", alignItems: "flex-start", mb: 1}}>
                            <Avatar
                                src={discussion.author_avatar || "/default-avatar.png"} // 默认头像
                                sx={{width: 40, height: 40, mr: 2}}
                            />
                            <Box sx={{flex: 1}}>
                                <Typography variant="subtitle1" sx={{fontWeight: "bold"}}>
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
                        <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
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
                                        sx={{fontStyle: 'italic'}}
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

        permissions: <StudentManagement students={students}/>,

    };

    return (
        <div className={styles.mainContainer}>

            <div className={styles.header}>
                <div className={styles.logo}>
                    <Image className={styles.logoIcon} src={logo} alt="Logo" priority/>
                    在线教育平台
                </div>
                {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{ width: '390px', fontSize: '16px' }} /> */}
                <NavigatorMenu initialCurrent={'course'}/>
                <div style={{display: 'flex', alignItems: 'center'}}>

                </div>
            </div>

            <div className={styles.profile}>
                <Image
                    src={whyAvatar}
                    alt="教师头像"
                    className={styles.avatar}
                    priority
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
                        {/* 权限管理模块 */}
                        <div className={styles.section}>
                            <h3>权限管理</h3>
                            <ul>
                                <li
                                    className={activeKey === "permissions" ? styles.active : ""}
                                    onClick={() => {
                                        setActiveKey("permissions"); // 切换到“学生管理”
                                    }}
                                >
                                    🔒 学生管理
                                </li>

                            </ul>
                        </div>
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

            </div>
            <Footer/>
        </div>

    );
}

