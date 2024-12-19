"use client";

import React, { useState, useEffect } from "react";
import CourseList from "./components/CourseList";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import whyAvatar from "../../assets/teacher/why.jpg"
import Image from "next/image";
import Link from 'next/link';
import { getAllCourses } from "../teacher/utils/indexDB";
import NavigatorMenu from "../components/navigatorMenu/page";
import Footer from "../components/footer/page";
import logo from "../../assets/homePage/logo.png"
import {
    Box,
    Typography,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Checkbox,
    Card,
    CardContent,
} from '@mui/material';

// Mock 数据，包含50个学生信息
const mockStudents = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `学生${i + 1}`,
    email: `student${i + 1}@example.com`,
    phone: `1380000${String(i + 1).padStart(4, "0")}`,
    status: i % 2 === 0 ? "active" : "suspended",
}));

const menuItems = [
    { key: 'courses', label: '我的课程', icon: '🎓' },
    { key: 'discussion', label: '讨论专区', icon: '💬' },
    { key: 'assignments', label: '作业管理', icon: '📝' },
];

// 添加作业列表样式
const assignmentStyles = {
    content: {
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
};

export default function TeacherDetailsPage() {
    const router = useRouter();
    const [students, setStudents] = useState(mockStudents); // 存储学生列表数据
    const [selectedStudents, setSelectedStudents] = useState([]); // 批量选中状态
    const [activeKey, setActiveKey] = useState('courses');
    const [userRole, setUserRole] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [error, setError] = useState('');
    const toggleSelection = (id) => {
        setSelectedStudents((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const resetPassword = (id) => {
        alert(`学生ID: ${id} 的密码已重置为默认密码: "123456"`);
    };
    React.useEffect(() => {
        // 获取 localStorage 中的 userId
        const userRole = localStorage.getItem('role');
        const userName = localStorage.getItem('name');

        // 如果 userId 存在，表示用户已登录
        if (userRole) {
            setUserRole(userRole);
            // setUserName(userName);
        }
    }, []); // 空数组，表示只在组件挂载时执行一次
    const toggleStatus = (id) => {
        setStudents((prev) =>
            prev.map((student) =>
                student.id === id
                    ? { ...student, status: student.status === "active" ? "suspended" : "active" }
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
    const [Ncourses, setNCourses] = useState([]);
    const [tasks, setTasks] = useState([]);

    const fetchDiscussions = async () => {
        try {
            const response = await fetch('/api/discussions/recent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    teacherId: localStorage.getItem("userId")
                })
            });

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
    // 点击事件处理，跳转到登录页面
    const handleLoginClick = () => {
        router.push("/auth/login");
    };

    // 点击事件处理，跳转到注册页面
    const handleRegisterClick = () => {
        router.push("/auth/register");
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

        const fetchNCourse = async () => {
            try {
                const data = await getAllCourses();
                setNCourses(data);
                console.log("Course data:", data);
            } catch (error) {
                console.error("加载课程列表失败：", error);
                setNCourses([]);
            }
        }

        const fetchAssignments = async () => {
            try {
                const response = await fetch('/api/assignments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        teacherId: localStorage.getItem('userId')
                    })
                });

                if (!response.ok) {
                    throw new Error('获取作业列表失败');
                }

                const data = await response.json();
                setAssignments(data.assignments.map(assignment => ({
                    ...assignment,
                    deadline: new Date(assignment.deadline).toLocaleString(),
                    status: getAssignmentStatus(assignment)
                })));
            } catch (error) {
                console.error('获取作业列表失败:', error);
                setError('获取作业列表失败');
            }
        };

        fetchCourses();
        fetchNCourse();
        fetchDiscussions();
        fetchAssignments();
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

    const goToUploadPic = (courseId) => {
        router.push(`/teacher/uploadPic?courseId=${courseId}`);
    };

    const goToUpdateInfo = (courseId) => {
        router.push(`/teacher/updateInfo?courseId=${courseId}`);
    };

    const getAssignmentStatus = (assignment) => {
        const now = new Date();
        const deadline = new Date(assignment.deadline);

        if (now > deadline) {
            return '已截止';
        }
        if (assignment.submission_count > 0) {
            return `已提交 ${assignment.submission_count}`;
        }
        return '进行中';
    };

    function StudentManagement({ students }) {
        return (
            <div className={styles.content}>
                <h2>学生管理</h2>
                <Button
                    variant="contained"
                    color="error"
                    onClick={deleteSelectedStudents}
                    style={{ marginBottom: "16px" }}
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
                                            style={{ marginLeft: "8px" }}
                                        >
                                            {student.status === "active" ? "禁用" : "启用"}
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="error"
                                            onClick={() => deleteStudent(student.id)}
                                            style={{ marginLeft: "8px" }}
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

    console.log("Course :", Ncourses);


    const ContentComponents = {

        courses: <div className={styles.content}>
            <div className={styles.courses}>
                <h2>我的课程</h2>
                <CourseList
                    courses={Ncourses}
                    onUploadClick={goToCoursewareUpload}
                    onHomeworkClick={goToHomeworkPublish}
                    onPickClick={goToUploadPic}
                    onUpdateClick={goToUpdateInfo}

                />
                <CourseList
                    courses={courses}
                    onUploadClick={goToCoursewareUpload}
                    onHomeworkClick={goToHomeworkPublish}
                    onPickClick={goToUploadPic}
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
            <Typography variant="h6" gutterBottom>
                作业列表
            </Typography>

            {assignments.map((assignment) => (
                <Card key={assignment.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    {assignment.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    课程：{assignment.course_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    截止时间：{new Date(assignment.deadline).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    满分：{assignment.max_score}分
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: assignment.status === '已截止' ? 'error.main' :
                                            assignment.status.includes('已提交') ? 'success.main' :
                                                'warning.main',
                                        mb: 1
                                    }}
                                >
                                    {assignment.status}
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => router.push(`/teacher/assignment/${assignment.id}`)}
                                >
                                    查看详情
                                </Button>
                            </Box>
                        </Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 2,
                                p: 1,
                                bgcolor: 'grey.50',
                                borderRadius: 1,
                                whiteSpace: 'pre-line'
                            }}
                        >
                            {assignment.description}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </div>,

        permissions: <StudentManagement students={students} />,

    };

    return (
        <div className={styles.mainContainer} >

            <div className={styles.header}>
                <div className={styles.logo}>
                    <Image className={styles.logoIcon} src={logo} alt="Logo" priority />
                    在线教育平台
                </div>
                {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{ width: '390px', fontSize: '16px' }} /> */}
                <NavigatorMenu initialCurrent={'personal'} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {!userRole ? (
                        <div>
                            <Button type="primary" onClick={handleLoginClick}>登录</Button>
                            <Button onClick={handleRegisterClick} style={{ marginLeft: 10 }}>注册</Button>
                        </div>
                    ) : (
                        <Button
                            onClick={() => {
                                localStorage.clear();
                                router.push('/');
                            }}
                            style={{ marginLeft: 60 }}
                        >
                            退出登录
                        </Button>
                    )}
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
                        {/* 权限管理模�� */}
                        <div className={styles.section}>

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
            <Footer />
        </div>

    );
}

