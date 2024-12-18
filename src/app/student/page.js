'use client';
import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    Box,
    Typography,
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
    CardMedia,
    CardContent,
    Button,
    Input,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    AssignmentLate,
    AssignmentTurnedIn,
    Book,
    Timeline,
    AccessTime,
    PlayCircleOutline,
} from '@mui/icons-material';
import styles from "./page.module.css";
import TaskList from '../components/student/TaskList';
import LearningStats from '../components/student/LearningStats';
import ToolBox from '../components/student/ToolBox';
import Image from 'next/image';
import logo from "../../assets/homePage/logo.png";
import NavigatorMenu from '../components/navigatorMenu/page';
import Link from 'next/link';  // 确保添加这个导入
import { useRouter } from 'next/navigation';
import { uploadFile } from '@/app/utils/oss';

// 创建亮色主题
const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: 'rgb(245, 245, 245)',
            paper: '#ffffff',
        },
        text: {
            primary: '#000000',
            secondary: '#666666',
        },
    },
});

export default function StudentDashboard() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [studyTimeData, setStudyTimeData] = useState([]);
    const [courseProgress, setCourseProgress] = useState([]);
    const [deadlines, setDeadlines] = useState([]);
    const [currentTool, setCurrentTool] = useState('dashboard');
    const [studentName, setStudentName] = useState('张三');
    const [studentId, setStudentId] = useState('20221500'); // 初始学号
    const [signature, setSignature] = useState('勤学好问，知行合一'); // 初始签名
    const [avatar, setAvatar] = useState(null); // 头像上传
    const [userRole, setUserRole] = useState('');
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalHours: 0,
    });
    const [discussions, setDiscussions] = useState([]);
    const [discussionStats, setDiscussionStats] = useState({
        post_count: 0,
        reply_count: 0,
        received_replies: 0
    });
    const router = useRouter();

    const [isUploading, setIsUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        fetchStudentInfo();
        fetchMyCourses();
        fetchTasks();
        fetchStudyStats();
        fetchDiscussions();
        fetchDiscussionStats();
    }, []);
    // 在组件挂载时检查 localStorage
    React.useEffect(() => {
        // 获取 localStorage 中的 userId
        const userRole = localStorage.getItem('role');
        const userName = localStorage.getItem('rememberedAccount');

        // 如果 userId 存在，表示用户已登录
        if (userRole) {
            setUserRole(userRole);
            // setUserName(userName);
        }
    }, []); // 空数组，表示只在组件挂载时执行一次

    const fetchStudentInfo = async () => {
        try {
            const response = await fetch('/api/student-info', {
                headers: { 'userId': localStorage.getItem("userId") }
            });
            const data = await response.json();
            console.log('获取到的学生信息:', data);  // 调试日志

            // 直接使用返回的avatarUrl
            if (data.avatarUrl) {
                setAvatarUrl(data.avatarUrl);
                console.log('设置头像URL:', data.avatarUrl);
            }

            setStudentName(data.name);
            setStudentId(data.student_number);
            setSignature(data.signature);
        } catch (error) {
            console.error('获取学生信息失败:', error);
        }
    };

    const fetchMyCourses = async () => {
        try {
            const response = await fetch('/api/enrollments/my-courses', {
                headers: {
                    'userId': localStorage.getItem("userId")
                }
            });
            if (!response.ok) {
                throw new Error('获取课程失败');
            }
            const data = await response.json();
            setCourses(data);
        } catch (err) {
            setError(err.message);
            console.error('获取课程失败:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks/pending', {
                headers: {
                    'userId': localStorage.getItem("userId")
                }
            });
            if (!response.ok) {
                throw new Error('获取任务失败');
            }
            const data = await response.json();
            console.log(data);
            setTasks(data.tasks || []);
        } catch (err) {
            console.error('获取任务失败:', err);
            setTasks([]);
        }
    };

    const fetchStudyStats = async () => {
        try {
            const response = await fetch('/api/study-stats', {
                headers: {
                    'userId': localStorage.getItem("userId")
                }
            });
            if (!response.ok) {
                throw new Error('获取学习统计失败');
            }
            const data = await response.json();
            setStudyTimeData(data.studyTime);
            setCourseProgress(data.progress);
            setDeadlines(data.deadlines);
            setStats(data.stats);
        } catch (err) {
            console.error('获取学习统计失败:', err);
        }
    };

    const fetchDiscussions = async () => {
        try {
            const response = await fetch('/api/discussions/recent', {
                headers: {
                    'userId': localStorage.getItem("userId")
                }
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

    const fetchDiscussionStats = async () => {
        try {
            const response = await fetch('/api/discussions/stats', {
                headers: {
                    'userId': localStorage.getItem("userId")
                }
            });
            if (!response.ok) {
                throw new Error('获取讨论统计失败');
            }
            const data = await response.json();
            setDiscussionStats(data);
        } catch (err) {
            console.error('获取讨论统计失败:', err);
        }
    };

    const handleToolChange = (toolId) => {
        setCurrentTool(toolId);
    };

    // 添加更新学习时间的函数
    const updateStudyTime = async (courseId) => {
        try {
            const response = await fetch(`/api/courses/${courseId}/study`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: localStorage.getItem("userId")
                })
            });

            if (!response.ok) {
                throw new Error('更新学习时间失败');
            }

            const result = await response.json();
            console.log('更新学习时间成功:', result);

            // 更新本地课程数据
            setCourses(prevCourses => prevCourses.map(course => {
                if (course.id === courseId) {
                    return {
                        ...course,
                        last_studied_at: new Date().toISOString()
                    };
                }
                return course;
            }));

        } catch (error) {
            console.error('更新学习时间失败:', error);
        }
    };

    const handleAvatarUpload = async (event) => {
        try {
            setIsUploading(true);
            const file = event.target.files[0];
            if (!file) return;

            // 文件验证
            if (!file.type.startsWith('image/')) {
                alert('请上传图片文件');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('图片大小不能超过5MB');
                return;
            }

            // 上传到OSS
            console.log('开始上传到OSS');
            const result = await uploadFile(file, 'avatars');
            console.log('OSS上传结果:', result);

            if (!result.path) {
                throw new Error('获取文件路径失败');
            }

            // 更新数据库
            const response = await fetch('/api/student-info/avatar', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': localStorage.getItem("userId")
                },
                body: JSON.stringify({
                    avatar: result.path
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '更新头像失败');
            }

            const data = await response.json();
            console.log('更新头像成功:', data);

            // 刷新学生信息以获取新的头像URL
            await fetchStudentInfo();

            alert('头像更新成功');

        } catch (error) {
            console.error('头像上传失败:', error);
            alert(error.message || '头像上传失败，请重试');
        } finally {
            setIsUploading(false);
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
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className={styles.container}>
                {/* 页首导航 */}
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <Image className={styles.logoIcon} src={logo} alt="Logo" priority />
                        在线教育平台
                    </div>
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
                {/* 个人信息概览 */}
                <Box
                    className="top-box"
                    sx={{
                        width: '100%',
                        height: 180,
                        position: 'relative',
                        mt: 10,
                        mb: 4,
                    }}
                >
                    {/* 背景图片 */}
                    <Box
                        component="img"
                        src="/imageView.png"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 0
                        }}
                    />

                    {/* 用户信息容器 */}
                    <Container
                        maxWidth="lg"
                        sx={{
                            position: 'relative',
                            zIndex: 1,
                            height: '100%',
                            pt: 3,
                            pb: 2
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: 'white',
                            fontFamily: '"Microsoft YaHei", "微软雅黑", sans-serif'
                        }}>
                            {/* 左侧：头像和基本信息 */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3
                            }}>
                                {/* 头像区域 */}
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        src={avatarUrl || '/default-avatar.png'}
                                        alt={studentName}
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            mb: 2
                                        }}
                                    />
                                    <Box sx={{ mt: 1 }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            component="label"
                                            disabled={isUploading}
                                        >
                                            {isUploading ? '上传中...' : '上传新头像'}
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                            />
                                        </Button>
                                    </Box>
                                </Box>

                                {/* 学号、签名和用户名 */}
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {studentName}
                                    </Typography>

                                    {/* 学号（不可修改） */}
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>学号：</Typography>
                                        <Typography variant="body2" sx={{ color: 'white' }}>
                                            {studentId}
                                        </Typography>
                                    </Box>

                                    {/* 签名（可编辑） */}
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Typography variant="body2">签名：</Typography>
                                        <Input
                                            value={signature}
                                            onChange={(e) => setSignature(e.target.value)}
                                            sx={{ color: 'white', borderBottom: '1px solid white', width: '100%' }}
                                        />
                                    </Box>
                                </Box>

                            </Box>
                        </Box>
                    </Container>

                </Box>

                {/* 主要内容区域 */}
                <Container maxWidth="lg" sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                        {/* 左侧工具箱 */}
                        <Grid
                            item
                            xs={12}
                            md={3}
                            sx={{
                                width: '280px',
                                position: 'sticky',
                                top: '80px',
                                height: 'fit-content',
                                alignSelf: 'flex-start'
                            }}
                        >
                            <ToolBox currentTool={currentTool} onToolChange={handleToolChange} />
                        </Grid>

                        {/* 右侧主要内容区域 */}
                        <Grid item xs={12} md={9}>
                            {currentTool === 'dashboard' && (
                                <Grid container spacing={3}>
                                    {/* 学习进度总览 */}
                                    <Grid item xs={12} md={8}>
                                        <Card sx={{ p: 2 }}>
                                            <Typography variant="h6" gutterBottom>
                                                正在学习的课程
                                            </Typography>
                                            {loading ? (
                                                <Box sx={{ p: 2 }}>
                                                    <Typography>加载中...</Typography>
                                                </Box>
                                            ) : error ? (
                                                <Box sx={{ p: 2 }}>
                                                    <Typography color="error">{error}</Typography>
                                                </Box>
                                            ) : courses.length === 0 ? (
                                                <Box sx={{ p: 2 }}>
                                                    <Typography color="text.secondary">暂无在学课程</Typography>
                                                </Box>
                                            ) : (
                                                courses.map((course, index) => (
                                                    <Box
                                                        key={`dashboard-course-${course.id}-${course.enrollment_date}-${index}`}
                                                        sx={{ mb: 2 }}
                                                    >
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                            <Typography variant="body1" noWrap sx={{ maxWidth: '70%' }}>
                                                                {course.title}
                                                            </Typography>
                                                            <Typography variant="body2" color="primary">
                                                                {course.progress}%
                                                            </Typography>
                                                        </Box>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={course.progress}
                                                            sx={{ height: 6, borderRadius: 3 }}
                                                        />
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                            已学习 {course.completed_hours}/{course.total_hours} 小时
                                                        </Typography>
                                                    </Box>
                                                ))
                                            )}
                                        </Card>
                                    </Grid>

                                    {/* 待办事项快捷入口 */}
                                    <Grid item xs={12} md={4}>
                                        <Card sx={{ p: 2 }}>
                                            <Typography variant="h6" gutterBottom>
                                                学习概览
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
                                                        <Book color="primary" sx={{ fontSize: 40 }} />
                                                        <Typography variant="h6">{courses.length}</Typography>
                                                        <Typography variant="body2">在学课程</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
                                                        <Timeline color="primary" sx={{ fontSize: 40 }} />
                                                        <Typography variant="h6">
                                                            {stats.avgProgress}%
                                                        </Typography>
                                                        <Typography variant="body2">平均完成度</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>

                                    {/* 待完成任务列表 */}
                                    <Grid item xs={12}>
                                        <Card sx={{ p: 2 }}>
                                            <TaskList tasks={tasks} />
                                        </Card>
                                    </Grid>

                                    {/* 学习数据可视化 */}
                                    <Grid item xs={12}>
                                        <Card sx={{ p: 2 }}>
                                            <LearningStats
                                                courseProgress={courseProgress}
                                                deadlines={deadlines}
                                            />
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}

                            {currentTool === 'my-courses' && (
                                <Grid container spacing={3}>
                                    {courses.map((course, index) => (
                                        <Grid item xs={12} sm={6} md={4}
                                            key={`my-course-${course.id}-${index}-${course.last_studied_at || Date.now()}`}
                                        >
                                            <Card sx={{ height: '100%' }}>
                                                <CardMedia
                                                    component="img"
                                                    sx={{ height: 240 }}
                                                    image={course.thumbnail || '/imageView.png'}
                                                    alt={course.title}
                                                />
                                                <CardContent>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography
                                                            variant="h6"
                                                            noWrap
                                                            sx={{
                                                                cursor: 'pointer',
                                                                '&:hover': {
                                                                    color: 'primary.main'
                                                                }
                                                            }}
                                                            onClick={() => {
                                                                window.open(`/student/course/${course.id}`, '_blank');
                                                            }}
                                                        >
                                                            {course.title}
                                                        </Typography>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            授课教师：{course.instructor_name}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ mb: 2 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                学习进度
                                                            </Typography>
                                                            <Typography variant="body2" color="primary">
                                                                {course.progress}%
                                                            </Typography>
                                                        </Box>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={course.progress}
                                                            sx={{ height: 6, borderRadius: 3 }}
                                                        />
                                                    </Box>

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <AccessTime fontSize="small" color="action" />
                                                            <Typography variant="body2">
                                                                {course.completed_hours}/{course.total_hours}小时
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            上次学习：{new Date(course.last_studied_at).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '60%' }}>
                                                            下一课：{course.nextLesson || '暂无'}
                                                        </Typography>
                                                        <Link href={`/student/course/${course.id}`} target="_blank">
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                startIcon={<PlayCircleOutline />}
                                                            >
                                                                继续学习
                                                            </Button>
                                                        </Link>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {/* 其他工具内容区域 */}
                            {currentTool === 'discuss' && (
                                <Grid container spacing={3}>
                                    {/* 最新讨论列表 */}
                                    <Grid item xs={12} md={8}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>最新讨论</Typography>
                                                {discussions.map((discussion, index) => (
                                                    <Box
                                                        key={`discussion-${discussion.id}-${index}`}
                                                        sx={{
                                                            p: 2,
                                                            '&:not(:last-child)': {
                                                                borderBottom: '1px solid',
                                                                borderColor: 'divider'
                                                            }
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                                            <Avatar
                                                                src={discussion.author_avatar}
                                                                sx={{ width: 40, height: 40, mr: 2 }}
                                                            />
                                                            <Box sx={{ flex: 1 }}>
                                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                                    {discussion.title}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {discussion.author_name} · {discussion.course_name} ·
                                                                    {new Date(discussion.created_at).toLocaleDateString()}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                mb: 2,
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            {discussion.content}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {discussion.reply_count} 回复
                                                            </Typography>
                                                            <Link href={`/student/discussion/${discussion.id}`} target="_blank">
                                                                <Button
                                                                    size="small"
                                                                >
                                                                    查看详情
                                                                </Button>
                                                            </Link>
                                                        </Box>
                                                    </Box>
                                                ))}
                                                {discussions.length === 0 && (
                                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                                        <Typography color="text.secondary">
                                                            暂无讨论内容
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* 热门话题和统计 */}
                                    <Grid item xs={12} md={4}>
                                        <Card sx={{ mb: 3 }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>热门话题</Typography>
                                                {['课程学习', '作业讨论', '技术交流', '学习方法'].map((topic, index) => (
                                                    <Box
                                                        key={`topic-${index}`}
                                                        sx={{
                                                            py: 1,
                                                            '&:not(:last-child)': {
                                                                borderBottom: '1px solid',
                                                                borderColor: 'divider'
                                                            }
                                                        }}
                                                    >
                                                        <Typography variant="body1">#{topic}</Typography>
                                                    </Box>
                                                ))}
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>讨论统计</Typography>
                                                <Box sx={{ '& > div': { mb: 2 } }}>
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">我的发帖</Typography>
                                                        <Typography variant="h6">{discussionStats.post_count}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">我的回复</Typography>
                                                        <Typography variant="h6">{discussionStats.reply_count}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">收到的回复</Typography>
                                                        <Typography variant="h6">{discussionStats.received_replies}</Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}
                            {currentTool === 'my' && (
                                <Card sx={{ p: 2 }}>
                                    <Typography variant="h6">我的学习</Typography>
                                    <Typography variant="body1" sx={{ mt: 2 }}>我的学习</Typography>
                                </Card>
                            )}

                            {currentTool === 'assignments' && (
                                <Grid container spacing={3}>
                                    {/* 待办事项 */}
                                    <Grid item xs={12} md={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    <AssignmentLate color="error" />
                                                    待完成
                                                </Typography>
                                                <TableContainer>
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
                                                                            <Link href={`/student/assignment/${task.id}`} target="_blank">
                                                                                <Button
                                                                                    size="small"
                                                                                    variant="contained"
                                                                                >
                                                                                    开始
                                                                                </Button>
                                                                            </Link>
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
                                                                        暂无待完成作业
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* 已完成事项 */}
                                    <Grid item xs={12} md={6}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    <AssignmentTurnedIn color="success" />
                                                    已完成
                                                </Typography>
                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>作业名称</TableCell>
                                                                <TableCell>课程</TableCell>
                                                                <TableCell align="right">提交时间</TableCell>
                                                                <TableCell align="right">成绩</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {tasks.filter(task => task.completed).map((task, index) => (
                                                                <TableRow key={`completed-${task.id}-${index}`}>
                                                                    <TableCell>{task.title}</TableCell>
                                                                    <TableCell>{task.courseName}</TableCell>
                                                                    <TableCell align="right">
                                                                        {new Date(task.submittedAt).toLocaleDateString()}
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        {task.score ? `${task.score}分` : '待批改'}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                            {tasks.filter(task => task.completed).length === 0 && (
                                                                <TableRow>
                                                                    <TableCell colSpan={4} align="center">
                                                                        暂无已完成作业
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}

                            {currentTool === 'learning-history' && (
                                <Card sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>学习历史</Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                                        {[
                                            { id: 1, title: 'Java语言程序设计 6.3 Map集合类', views: '55.7万', comments: 34, likes: '2千', image: '/video.png', time: '03:11' },
                                            { id: 2, title: '数据分析从入门到精通 第十章', views: '720.8万', comments: '3万', likes: 'SMTOWN', image: '/video2.png', time: '03:11' },
                                            { id: 3, title: '编程实战：做出你的第一个项目 第四节', views: '6.3万', comments: 99, likes: '16小时前', image: '/video3.png', time: '02:41' },
                                            { id: 4, title: '编程实战：做出你的第一个项目 第三节', views: '12.5万', comments: 500, likes: '1千', image: '/video3.png', time: '05:00' },
                                            { id: 5, title: '学习Python基础语法', views: '34.8万', comments: 200, likes: '3千', image: '/video1.png', time: '04:20' },
                                            { id: 6, title: 'AI技术入门', views: '45.9万', comments: 600, likes: '2千', image: '/video4.png', time: '06:30' },
                                            { id: 7, title: '数据分析从入门到精通 第九章', views: '28.1万', comments: 150, likes: '800', image: '/video2.png', time: '03:50' },
                                            { id: 8, title: '英语口语练习方法', views: '18.7万', comments: 100, likes: '700', image: '/video5.png', time: '03:45' },
                                            { id: 9, title: 'Java语言程序设计 6.2 Collection集合类', views: '22.6万', comments: 240, likes: '900', image: '/video.png', time: '07:15' },
                                            { id: 10, title: '计算机网络概论', views: '52.4万', comments: 180, likes: '1.5千', image: '/video7.png', time: '04:10' },
                                        ].map((video) => (
                                            <Card
                                                key={video.id}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 1,
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                                    '&:hover': {
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: 3,
                                                    },
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={video.image}
                                                    alt={video.title}
                                                    sx={{
                                                        width: '100%',
                                                        height: 150,
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <Box sx={{ p: 2 }}>
                                                    <Typography variant="subtitle1" noWrap>
                                                        {video.title}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', mt: 1 }}>
                                                        <Typography variant="body2">观看: {video.views}</Typography>
                                                        <Typography variant="body2">评论: {video.comments}</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                                                        时长: {video.time}
                                                    </Typography>
                                                </Box>
                                            </Card>
                                        ))}
                                    </Box>
                                </Card>
                            )}



                            {currentTool === 'learning-notes' && (
                                <Card sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>学习笔记</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {[
                                            { id: 1, title: 'Java基础语法', date: '2024-05-01', content: '学习了Java变量、数据类型、流程控制等基础内容。' },
                                            { id: 2, title: 'Python文件操作', date: '2024-05-02', content: '学习了如何读取和写入文件，以及with语句的用法。' },
                                            { id: 3, title: 'React组件化开发', date: '2024-05-03', content: 'React的组件生命周期、Hooks的使用和props传参。' },
                                            { id: 4, title: '数据结构：链表', date: '2024-05-04', content: '掌握了单链表和双向链表的原理��实现。' },
                                            { id: 5, title: '算法：排序算法', date: '2024-05-05', content: '理解冒泡排序、选择排序和快速排序的实现及复杂度。' },
                                            { id: 6, title: 'Vue 3响应式原理', date: '2024-05-06', content: '学习了Vue 3中响应式数据的实现原理和Proxy用法。' },
                                            { id: 7, title: '数据库设计规范', date: '2024-05-07', content: '数据库三范式、主键与外键约束的设计方法。' },
                                            { id: 8, title: '网络请求与Axios', date: '2024-05-08', content: '学习了如何用Axios进行RESTful API调用及错误处理。' },
                                            { id: 9, title: 'Git分支管理', date: '2024-05-09', content: '熟练使用Git的分支命令：git branch、git merge、git rebase等。' },
                                            { id: 10, title: 'Linux基本命令', date: '2024-05-10', content: '掌握了ls、cd、mv、rm、grep等常用命令的用法。' },
                                        ].map((note) => (
                                            <Card
                                                key={note.id}
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: 3,
                                                    },
                                                }}
                                            >
                                                <Typography variant="h6" gutterBottom>{note.title}</Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    日期: {note.date}
                                                </Typography>
                                                <Typography variant="body1" color="text.primary">
                                                    {note.content}
                                                </Typography>
                                            </Card>
                                        ))}
                                    </Box>
                                </Card>
                            )}


                            {currentTool === 'favorites' && (
                                <Card sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        我的收藏
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                            gap: 2,
                                        }}
                                    >
                                        {[
                                            { id: 1, title: 'Java语言程序设计', description: '掌握Java编程基础', image: '/video.png', instructor: '李老师', likes: 120 },
                                            { id: 2, title: '数据分析实战入门', description: '数据分析工具与方法', image: '/video2.png', instructor: '王教授', likes: 300 },
                                            { id: 3, title: 'Python高级编程', description: 'Python项目实战', image: '/video1.png', instructor: '张老师', likes: 220 },
                                            { id: 4, title: '编程实战：做出你的第一个项目', description: '搭建现代前端项目', image: '/video3.png', instructor: '李工', likes: 150 },
                                            { id: 5, title: '机器学习基础', description: '算法与应用讲解', image: '/video6.png', instructor: 'AI专家', likes: 270 },
                                            { id: 6, title: '计算机网络概论', description: '网络协议与架构', image: '/video7.png', instructor: '赵博士', likes: 180 },
                                        ].map((item) => (
                                            <Card
                                                key={item.id}
                                                sx={{
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    boxShadow: 2,
                                                    position: 'relative',
                                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                                    '&:hover': {
                                                        transform: 'translateY(-5px)',
                                                        boxShadow: 5,
                                                    },
                                                }}
                                            >
                                                {/* 封面图 */}
                                                <Box sx={{ position: 'relative' }}>
                                                    <Box
                                                        component="img"
                                                        src={item.image}
                                                        alt={item.title}
                                                        sx={{ width: '100%', height: 160, objectFit: 'cover' }}
                                                    />
                                                    {/* 取消收藏按钮 */}
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            bgcolor: 'rgba(0,0,0,0.5)',
                                                            color: 'white',
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            cursor: 'pointer',
                                                            fontSize: 12,
                                                            transition: 'background 0.3s',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(0,0,0,0.7)',
                                                            },
                                                        }}
                                                    >
                                                        取消收藏
                                                    </Box>
                                                </Box>

                                                {/* 课程内容 */}
                                                <Box sx={{ p: 2 }}>
                                                    <Typography variant="h6" noWrap>
                                                        {item.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" noWrap>
                                                        {item.description}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                        讲师: {item.instructor}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                        <Typography variant="body2" color="primary">
                                                            {item.likes} 收藏
                                                        </Typography>
                                                        <Link href={`/student/course/${item.id}`} target="_blank">
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                color="primary"
                                                            >
                                                                查看详情
                                                            </Button>
                                                        </Link>
                                                    </Box>
                                                </Box>
                                            </Card>
                                        ))}
                                    </Box>
                                </Card>
                            )}


                            {currentTool === 'my-mistakes' && (
                                <Card sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        我的错题
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                            mt: 2,
                                        }}
                                    >
                                        {[
                                            { id: 1, course: 'Java语言程序设计', chapter: '第6章：集合框架', type: '练习', question: 'Map集合的特性是什么？' },
                                            { id: 2, course: '数据结构与算法', chapter: '第3章：树结构', type: '考试', question: '二叉树的中序遍历顺序是什么？' },
                                            { id: 3, course: 'Python编程基础', chapter: '第4章：函数与模块', type: '练习', question: 'Python如何定义一个可选参数？' },
                                            { id: 4, course: '计算机网络', chapter: '第5章：网络层', type: '考试', question: 'IP地址的子网划分规则是什么？' },
                                            { id: 5, course: '操作系统原理', chapter: '第2章：进程管理', type: '练习', question: '进程和线程的区别是什么？' },
                                            { id: 6, course: '数据库系统概论', chapter: '第3章：SQL查询', type: '考试', question: 'SQL中如何进行多表联结查询？' },
                                            { id: 7, course: '线性代数', chapter: '第1章：向量', type: '练习', question: '向量的线性组合是什么？' },
                                            { id: 8, course: '软件工程导论', chapter: '第6章：需求分析', type: '考试', question: '软件需求文档的主要内容有哪些？' },
                                            { id: 9, course: '机器学习基础', chapter: '第5章：分类模型', type: '练习', question: '逻辑回归的目标函数是什么？' },
                                            { id: 10, course: '高等数学', chapter: '第7章：积分学', type: '考试', question: '定积分的几何意义是什么？' },
                                        ].map((mistake) => (
                                            <Card
                                                key={mistake.id}
                                                sx={{
                                                    p: 2,
                                                    boxShadow: 2,
                                                    borderRadius: 2,
                                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                                    '&:hover': {
                                                        transform: 'translateY(-5px)',
                                                        boxShadow: 5,
                                                    },
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                    {/* 课程和章节 */}
                                                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                                        课程：{mistake.course}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        章节：{mistake.chapter}
                                                    </Typography>
                                                    {/* 错题类型 */}
                                                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                                        类型：{mistake.type}
                                                    </Typography>
                                                    {/* 问题内容 */}
                                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                                        {mistake.question}
                                                    </Typography>
                                                </Box>
                                            </Card>
                                        ))}
                                    </Box>
                                </Card>
                            )}
                            {/* ... 其他工具的条件渲染 ... */}
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </ThemeProvider >
    );
} 