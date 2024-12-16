'use client';
import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    AssignmentLate,
    AssignmentTurnedIn,
    Book,
    Timeline,
    AccessTime,
    PlayCircleOutline,
    SearchOutlined,
} from '@mui/icons-material';
import styles from "./page.module.css";
import TaskList from '../components/student/TaskList';
import LearningStats from '../components/student/LearningStats';
import ToolBox from '../components/student/ToolBox';
import Image from 'next/image';
import logo from "../../assets/homePage/logo.png";
import NavigatorMenu from '../components/navigatorMenu/page';
import { useRouter } from 'next/navigation';

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
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalHours: 0,
        avgProgress: 0,
        completedCourses: 0
    });
    const [discussions, setDiscussions] = useState([]);
    const [discussionStats, setDiscussionStats] = useState({
        post_count: 0,
        reply_count: 0,
        received_replies: 0
    });
    const router = useRouter();

    useEffect(() => {
        fetchMyCourses();
        fetchTasks();
        fetchStudyStats();
        fetchDiscussions();
        fetchDiscussionStats();
    }, []);

    const fetchMyCourses = async () => {
        try {
            const response = await fetch('/api/enrollments/my-courses');
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

    const fetchStudyStats = async () => {
        try {
            const response = await fetch('/api/study-stats');
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

    const fetchDiscussionStats = async () => {
        try {
            const response = await fetch('/api/discussions/stats');
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
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('更新学习时间失败');
            }

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

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className={styles.container}>
                {/* 页首导航 */}
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <Image className={styles.logoIcon} src={logo} alt="Logo" />
                        在线教育平台
                    </div>
                    <NavigatorMenu initialCurrent={'alipay'} />
                    <div style={{
                        width: '400px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        paddingRight: '24px'  // 添加一些右侧padding
                    }}>
                        <Button
                            variant="outlined"
                            startIcon={<Avatar sx={{ width: 24, height: 24 }} />}
                            onClick={() => router.push('/student/')}
                            sx={{
                                color: 'black',
                                borderColor: 'rgba(0, 0, 0, 0.23)',
                                '&:hover': {
                                    borderColor: 'rgba(0, 0, 0, 0.87)',
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                },
                                textTransform: 'none',  // 防止文字自动大写
                                fontFamily: '"Microsoft YaHei", "微软雅黑", sans-serif'
                            }}
                        >
                            个人中心
                        </Button>
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
                                <Box sx={{
                                    position: 'relative',
                                    '&:hover .edit-avatar': {
                                        opacity: 1
                                    }
                                }}>
                                    <Avatar
                                        sx={{
                                            width: 96,
                                            height: 96,
                                            border: '2px solid white'
                                        }}
                                    />
                                    {/* 头像编辑提示 */}
                                    <Box
                                        className="edit-avatar"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            bgcolor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            textAlign: 'center',
                                            py: 0.5,
                                            opacity: 0,
                                            transition: 'opacity 0.3s',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        编辑头像
                                    </Box>
                                </Box>

                                {/* 用户名和标签 */}
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            maxWidth: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            mb: 1
                                        }}
                                    >
                                        张三
                                    </Typography>

                                    <Box sx={{
                                        display: 'inline-block',
                                        px: 2,
                                        py: 0.5,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        borderRadius: 1
                                    }}>
                                        学生
                                    </Box>
                                </Box>
                            </Box>

                            {/* 右侧：用户数据 */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3
                            }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>主题/回复</Typography>
                                    <Typography variant="h6">0</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>获赞数量</Typography>
                                    <Typography variant="h6">0</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>学习时长</Typography>
                                    <Typography variant="h6">
                                        {courses.reduce((total, course) => total + (course.completed_hours || 0), 0)}小时
                                    </Typography>
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
                                                    image={course.thumbnail || '/default-course.jpg'}
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
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            startIcon={<PlayCircleOutline />}
                                                            onClick={async () => {
                                                                await updateStudyTime(course.id);
                                                                window.open(`/student/course/${course.id}`, '_blank');
                                                            }}
                                                        >
                                                            继续学习
                                                        </Button>
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
                                                            <Button
                                                                size="small"
                                                                onClick={() => router.push(`/student/discussion/${discussion.id}`)}
                                                            >
                                                                查看详情
                                                            </Button>
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
                                                                            <Button
                                                                                size="small"
                                                                                variant="contained"
                                                                                onClick={() => router.push(`/student/assignment/${task.id}`)}
                                                                            >
                                                                                开始
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
                            {/* ... 其他工具的条件渲染 ... */}
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </ThemeProvider >
    );
} 