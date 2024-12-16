'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Typography,
    AppBar,
    Toolbar,
    LinearProgress,
    Divider,
    Card,
    CardContent,
    Chip,
    Stack,
    IconButton,
    Button,
    Avatar,
    Modal
} from '@mui/material';
import {
    ArrowForwardIos,
    Menu as MenuIcon,
    School,
    Share,
    Help,
    AccessTime,
    Close
} from '@mui/icons-material';
import CourseMenu from '@/app/components/student/CourseMenu';
import { getBase64, uploadFile } from '@/app/utils/oss';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { Blaka_Ink } from 'next/font/google';

export default function CourseDetail() {
    const params = useParams();
    const router = useRouter();
    const [selectedMenu, setSelectedMenu] = useState(0);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [discussions, setDiscussions] = useState([]);
    const [discussionLoading, setDiscussionLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [assignmentFilter, setAssignmentFilter] = useState('all'); // 'all', 'pending', 'completed'
    const [videos, setVideos] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(null);

    // 获取课程详情
    const fetchCourseDetail = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/courses/${params.id}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '获取课程详情失败');
            }
            const courseData = await response.json();
            console.log('Fetched course data:', courseData);
            setCourse(courseData);
        } catch (err) {
            setError(err.message);
            console.error('获取课程详情失败:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchCourseDetail();
        }
    }, [params.id]);

    useEffect(() => {
        if (params.id && selectedMenu === 4) {
            fetchCourseDiscussions();
        }
    }, [params.id, selectedMenu]);

    // 在渲染时输出 course.assignments 的状态
    useEffect(() => {
        console.log('Course assignments:', course?.assignments);
    }, [course]);

    useEffect(() => {
        if (course?.id) {
            // 设置视频和文档数据
            setVideos(course.videos || []);
            setDocuments(course.documents || []);
        }
    }, [course]);

    const fetchCourseDiscussions = async () => {
        try {
            setDiscussionLoading(true);
            const response = await fetch(`/api/discussions/course/${params.id}`);
            if (!response.ok) {
                throw new Error('获取讨论失败');
            }
            const data = await response.json();
            setDiscussions(data.discussions || []);
        } catch (err) {
            console.error('获取讨论失败:', err);
            setDiscussions([]);
        } finally {
            setDiscussionLoading(false);
        }
    };

    // 文件上传前的验证
    const beforeUpload = (file, fileType) => {
        const videoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
        const docTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];

        const isAllowedType = fileType === 'video'
            ? videoTypes.includes(file.type)
            : docTypes.includes(file.type);

        if (!isAllowedType) {
            message.error(`不支持的${fileType === 'video' ? '视频' : '文档'}格式！`);
            return false;
        }

        const isLt500M = file.size / 1024 / 1024 < 500;
        if (!isLt500M) {
            message.error('文件大小不能超过500MB！');
            return false;
        }

        return true;
    };

    // 处理文件上传
    const handleUpload = async (file, fileType) => {
        try {
            setUploading(true);
            const customDir = `course/${params.id}/${fileType}`;

            // 创建 FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('directory', customDir);

            // 使用统一的上传API
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('文件上传失败');
            }

            const result = await response.json();

            // 保存文件信息到数据库
            const dbResponse = await fetch(`/api/courses/${params.id}/${fileType}s`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: file.name,
                    url: result.url,
                    path: result.path,
                    size: file.size,
                    type: file.type
                }),
            });

            if (!dbResponse.ok) {
                throw new Error('保存文件信息失败');
            }

            const responseData = await dbResponse.json();

            // 更新状态
            if (fileType === 'video') {
                setVideos(prev => [responseData, ...prev]);
            } else {
                setDocuments(prev => [responseData, ...prev]);
            }

            // 使用 alert 替代 message
            alert('上传成功！');
            return result;
        } catch (error) {
            console.error('上传失败:', error);
            // 使用 alert 替代 message
            alert('上传失败：' + error.message);
            return null;
        } finally {
            setUploading(false);
        }
    };

    // 添加筛选函数
    const getFilteredAssignments = () => {
        if (!course?.assignments) return [];

        switch (assignmentFilter) {
            case 'pending':
                // 未完成：没有提交记录
                return course.assignments.filter(assignment => !assignment.submission);
            case 'completed':
                // 已完成：有提交记录
                return course.assignments.filter(assignment => assignment.submission);
            default:
                return course.assignments;
        }
    };

    // 添加视频播放处理函数
    const handlePlayVideo = (file) => {
        setCurrentVideo(file);
        setVideoModalOpen(true);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <LinearProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            {/* 顶部导航栏 */}
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{
                    height: 80,
                    display: 'flex',
                    justifyContent: 'center',
                    bgcolor: 'white',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Toolbar sx={{
                    height: '100%',
                    minHeight: '80px !important',
                    py: 2
                }}>
                    {/* 学校logo */}
                    <Box component="img"
                        src={course.schoolPanel?.imgUrl || "/school-logo.png"}
                        sx={{
                            height: 48,
                            width: 'auto',
                            mr: 3
                        }}
                        alt={course.schoolPanel?.name}
                    />

                    {/* 分隔线 */}
                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                            mx: 2,
                            height: '60%',
                            alignSelf: 'center'
                        }}
                    />

                    {/* 课程信息 */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flex: 1  // 占据剩余空间
                    }}>
                        {/* 课程图片 */}
                        <Box
                            component="img"
                            src={course.thumbnail || "/default-course.jpg"}
                            sx={{
                                height: 60,
                                width: 'auto',
                                borderRadius: 1,
                                objectFit: 'cover'
                            }}
                            alt={course.title}
                        />

                        {/* 课程名称和教师信息 */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 500,
                                    fontSize: '1.1rem',
                                    lineHeight: 1.2
                                }}
                            >
                                {course.title}
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center'
                            }}>
                                {course.teachers?.map((teacher, index) => (
                                    <Typography
                                        key={index}
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 500,
                                            color: 'text.secondary'
                                        }}
                                    >
                                        {teacher.name}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* 主体内容 */}
            <Box sx={{
                background: 'rgb(245, 245, 245)',
                minHeight: 'calc(100vh - 80px)',
                pt: 3,
                display: 'flex'
            }}>
                {/* 左侧菜单 - 移到外层 */}
                <Box sx={{
                    position: 'sticky',
                    top: 83,
                    alignSelf: 'flex-start',
                    width: 200,
                    minWidth: 200,
                    bgcolor: 'white',
                    borderRadius: 2,
                    ml: 3,
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                }}>
                    <CourseMenu
                        selected={selectedMenu}
                        onSelect={setSelectedMenu}
                    />
                </Box>

                {/* 右侧内容区域 */}
                <Box sx={{
                    flex: 1,
                    pr: 3,
                    pl: 2
                }}>
                    <Container
                        maxWidth={false}  // 移除最大宽度限制
                        disableGutters
                        sx={{
                            maxWidth: '1500px'  // 自定义更合适的最大宽度
                        }}
                    >
                        {/* 主内容区 */}
                        <Box sx={{
                            bgcolor: 'white',
                            borderRadius: 1,
                            boxShadow: 1,
                            p: 3,
                            mb: 3
                        }}>
                            {selectedMenu === 0 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        公告
                                    </Typography>
                                    {course.announcements?.map((announcement) => (
                                        <Box
                                            key={`announcement-${announcement.title}-${announcement.created_at}`}
                                            sx={{ mb: 2 }}
                                        >
                                            <Typography variant="h6" gutterBottom>
                                                {announcement.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(announcement.created_at).toLocaleDateString()}
                                            </Typography>
                                            <Typography sx={{ mt: 2 }}>
                                                {announcement.content}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {selectedMenu === 1 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        评分标准
                                    </Typography>
                                    <Card sx={{
                                        boxShadow: 'none',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}>
                                        <CardContent>
                                            <Typography>
                                                {course.grading_criteria || '暂无评分标准'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            )}

                            {selectedMenu === 2 && (
                                <Box>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 3
                                    }}>
                                        <Typography variant="h6">
                                            作业
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Chip
                                                label="全部"
                                                color={assignmentFilter === 'all' ? 'primary' : 'default'}
                                                variant={assignmentFilter === 'all' ? 'filled' : 'outlined'}
                                                onClick={() => setAssignmentFilter('all')}
                                                sx={{ borderRadius: 1 }}
                                            />
                                            <Chip
                                                label="未完成"
                                                color={assignmentFilter === 'pending' ? 'primary' : 'default'}
                                                variant={assignmentFilter === 'pending' ? 'filled' : 'outlined'}
                                                onClick={() => setAssignmentFilter('pending')}
                                                sx={{ borderRadius: 1 }}
                                            />
                                            <Chip
                                                label="已完成"
                                                color={assignmentFilter === 'completed' ? 'primary' : 'default'}
                                                variant={assignmentFilter === 'completed' ? 'filled' : 'outlined'}
                                                onClick={() => setAssignmentFilter('completed')}
                                                sx={{ borderRadius: 1 }}
                                            />
                                        </Box>
                                    </Box>

                                    <Stack spacing={2}>
                                        {getFilteredAssignments().map((assignment) => (
                                            <Card
                                                key={`assignment-${assignment.id}-${assignment.submission?.id || 'no-submission'}`}
                                                sx={{
                                                    boxShadow: 'none',
                                                    border: '1px solid',
                                                    borderColor: 'divider'
                                                }}
                                                onClick={() => router.push(`/student/assignment/${assignment.id}`)}
                                            >
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="h6">
                                                            {assignment.title}
                                                        </Typography>
                                                        <Chip
                                                            label={assignment.submission ? '已提交' : '未提交'}
                                                            color={assignment.submission ? 'success' : 'default'}
                                                            size="small"
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        截止时间：{new Date(assignment.deadline).toLocaleString()}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        {assignment.description}
                                                    </Typography>
                                                    {assignment.submission && (
                                                        <Box sx={{ mt: 1 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                提交时间：{new Date(assignment.submission.submitted_at).toLocaleString()}
                                                            </Typography>
                                                            {assignment.submission.score !== null && (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    得分：{assignment.submission.score} / {assignment.max_score}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}

                                        {getFilteredAssignments().length === 0 && (
                                            <Box
                                                sx={{
                                                    textAlign: 'center',
                                                    py: 4,
                                                    bgcolor: 'grey.50',
                                                    borderRadius: 1
                                                }}
                                            >
                                                <Typography color="text.secondary">
                                                    {assignmentFilter === 'pending' ? '没有未完成的作业' :
                                                        assignmentFilter === 'completed' ? '没有已完成的作业' :
                                                            '暂无作业'}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </Box>
                            )}
                            {selectedMenu === 3 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        考试
                                    </Typography>
                                    <Card sx={{
                                        boxShadow: 'none',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}>
                                        <CardContent>
                                            <Typography>
                                                {/* TODO：待开发 */}
                                                {'课程考试板块待开发'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            )}
                            {selectedMenu === 4 && (
                                <Box>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 3
                                    }}>
                                        <Typography variant="h6">
                                            课程讨论
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            onClick={() => router.push(`/student/course/${params.id}/discussion/new`)}
                                        >
                                            发起讨论
                                        </Button>
                                    </Box>

                                    {discussionLoading ? (
                                        <LinearProgress />
                                    ) : discussions.length > 0 ? (
                                        <Stack spacing={2}>
                                            {discussions.map((discussion) => (
                                                <Box
                                                    key={`discussion-${discussion.id}-${discussion.created_at}`}
                                                    sx={{
                                                        p: 2,
                                                        '&:not(:last-child)': {
                                                            borderBottom: '1px solid',
                                                            borderColor: 'divider'
                                                        },
                                                        '&:hover': {
                                                            bgcolor: 'action.hover',
                                                            cursor: 'pointer'
                                                        }
                                                    }}
                                                    onClick={() => {
                                                        window.open(`/student/discussion/${discussion.id}`, '_blank');
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                                        <Avatar
                                                            src={discussion.author_avatar}
                                                            sx={{ width: 40, height: 40, mr: 2 }}
                                                        />
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                                {discussion.title}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {discussion.author_name} ·
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
                                                            endIcon={<ArrowForwardIos sx={{ fontSize: 16 }} />}
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // 阻止事件冒泡
                                                                router.push(`/student/discussion/${discussion.id}`);
                                                            }}
                                                        >
                                                            查看详情
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Box
                                            sx={{
                                                textAlign: 'center',
                                                py: 4,
                                                bgcolor: 'grey.50',
                                                borderRadius: 1
                                            }}
                                        >
                                            <Typography color="text.secondary">
                                                暂无讨论内容
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            )}
                            {selectedMenu === 5 && (
                                <Box>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 3
                                    }}>
                                        <Typography variant="h6">
                                            课程视频
                                        </Typography>
                                        <Upload.Dragger
                                            name="file"
                                            multiple={false}
                                            showUploadList={true}
                                            accept=".mp4,.mov,.avi"
                                            beforeUpload={(file) => {
                                                const canUpload = beforeUpload(file, 'video');
                                                if (canUpload) {
                                                    handleUpload(file, 'video');
                                                }
                                                return false;
                                            }}
                                            fileList={videos}
                                            onChange={({ file, fileList }) => {
                                                console.log('视频上传状态变化:', file, fileList);
                                            }}
                                            onRemove={(file) => {
                                                setVideos(prev => prev.filter(item => item.id !== file.id));
                                            }}
                                        >
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">
                                                点击或拖拽文件到此区域上传
                                            </p>
                                            <p className="ant-upload-hint" style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                                                支持的视频格式：MP4、MOV、AVI
                                            </p>
                                            <p className="ant-upload-hint" style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                                                单个文件大小不超过500MB
                                            </p>
                                        </Upload.Dragger>
                                    </Box>

                                    <Stack spacing={2}>
                                        {videos.map((file) => (
                                            <Card
                                                key={file.unique_key || `video-${file.id}-${file.created_at}`}
                                                sx={{
                                                    boxShadow: 'none',
                                                    border: '1px solid',
                                                    borderColor: 'divider'
                                                }}
                                            >
                                                <CardContent sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <Box>
                                                        <Typography variant="subtitle1">
                                                            {file.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            大小: {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => handlePlayVideo(file)}
                                                        >
                                                            在线播放
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => window.open(file.url)}
                                                        >
                                                            下载
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                            {selectedMenu === 6 && (
                                <Box>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 3
                                    }}>
                                        <Typography variant="h6">
                                            课程文档
                                        </Typography>
                                        <Upload.Dragger
                                            name="file"
                                            multiple={false}
                                            showUploadList={true}
                                            accept=".pdf,.doc,.docx,.txt"
                                            beforeUpload={(file) => {
                                                const canUpload = beforeUpload(file, 'document');
                                                if (canUpload) {
                                                    handleUpload(file, 'document');
                                                }
                                                return false;
                                            }}
                                            fileList={documents}
                                            onChange={({ file, fileList }) => {
                                                console.log('文档上传状态变化:', file, fileList);
                                            }}
                                            onRemove={(file) => {
                                                setDocuments(prev => prev.filter(item => item.id !== file.id));
                                            }}
                                        >
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">
                                                点击或拖拽文件到此区域上传
                                            </p>
                                            <p className="ant-upload-hint" style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                                                支持的文件类型：PDF、Word文档(.doc/.docx)、文本文件(.txt)
                                            </p>
                                            <p className="ant-upload-hint" style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                                                单个文件大小不超过500MB
                                            </p>
                                        </Upload.Dragger>
                                    </Box>

                                    <Stack spacing={2}>
                                        {documents.map((file) => (
                                            <Card
                                                key={file.unique_key || `doc-${file.id}-${file.created_at}`}
                                                sx={{
                                                    boxShadow: 'none',
                                                    border: '1px solid',
                                                    borderColor: 'divider'
                                                }}
                                            >
                                                <CardContent sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <Box>
                                                        <Typography variant="subtitle1">
                                                            {file.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            大小: {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </Typography>
                                                    </Box>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => window.open(file.url)}
                                                    >
                                                        下载
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </Box>
                    </Container>
                </Box>
            </Box>

            {/* 添加视频播放模态框 */}
            <Modal
                open={videoModalOpen}
                onClose={() => setVideoModalOpen(false)}
                aria-labelledby="video-modal-title"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 2,
                    width: '90%',
                    maxWidth: '1200px',
                    maxHeight: '90vh',
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                    }}>
                        <Typography variant="h6" id="video-modal-title">
                            {currentVideo?.name}
                        </Typography>
                        <IconButton onClick={() => setVideoModalOpen(false)}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Box sx={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '56.25%', // 16:9 宽高比
                    }}>
                        {currentVideo && (
                            <video
                                src={currentVideo.url}
                                controls
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#000'
                                }}
                            >
                                您的浏览器不支持视频播放。
                            </video>
                        )}
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
} 