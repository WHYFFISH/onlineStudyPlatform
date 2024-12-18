'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    IconButton,
    Alert,
    Stack,
    Divider,
    Modal,
    Link,
} from '@mui/material';
import {
    ArrowBack,
    School,
    CloudUpload,
    Delete,
    InsertDriveFile,
    Download,
    Visibility,
} from '@mui/icons-material';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { ossClient, getBase64, uploadFile } from '@/app/utils/oss';

export default function AssignmentDetail() {
    const params = useParams();
    const router = useRouter();
    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    // 获取作业详情和提交记录
    useEffect(() => {
        const fetchAssignmentDetail = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/assignments/${params.id}`, {
                    headers: {
                        'userId': localStorage.getItem("userId")
                    }
                });
                if (!response.ok) throw new Error('获取作业详情失败');
                const data = await response.json();
                setAssignment(data);
                setSubmission(data.submission);
                if (data.submission) {
                    setContent(data.submission.content || '');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchAssignmentDetail();
        }
    }, [params.id]);

    // 修改handleFileUpload为处理antd Upload组件的上传
    const handleFileUpload = ({ file, fileList }) => {
        setFiles(fileList.map(f => ({
            ...f,
            status: f.status || 'done'
        })));
    };

    // 添加文件上传前的校验
    const beforeUpload = (file) => {
        const isAllowedType = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'image/jpeg',
            'image/png',
            'video/mp4',
            'audio/mpeg'
        ].includes(file.type);

        if (!isAllowedType) {
            setError('不支持的文件类型！');
            return false;
        }

        const isLt50M = file.size / 1024 / 1024 < 50;
        if (!isLt50M) {
            setError('文件大小不能超过50MB！');
            return false;
        }

        return false; // 阻止自动上传
    };

    // 移除文件
    const handleRemoveFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    // 提交作业
    const handleSubmit = async () => {
        try {
            setError('');
            setSuccess('');
            console.log('开始提交作业...');

            const formData = new FormData();
            formData.append('content', content);
            formData.append('userId', localStorage.getItem("userId"));

            // 处理所有待上传的文件
            for (const file of files) {
                if (file.originFileObj) {
                    formData.append('files', file.originFileObj);
                }
            }

            const response = await fetch(`/api/assignments/${params.id}/submit`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('提交失败');
            }

            const result = await response.json();
            console.log('提交成功:', result);

            if (result.success) {
                setSubmission(result.data);
                setSuccess('作业提交成功！');
                setFiles([]); // 清空文件列表

                // 在提交成功后跳转回课程页面
                router.push(`/student/course/${assignment.course_id}`);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            console.error('提交作业时出错:', err);
            setError(err.message);
        }
    };

    // 添加文件预览处理函数
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
    };

    if (loading) return <Typography>加载中...</Typography>;
    if (!assignment) return <Typography>未找到作业</Typography>;

    const isDeadlinePassed = new Date(assignment.deadline) < new Date();
    const canSubmit = !isDeadlinePassed && (!submission || submission.status !== 'submitted');

    console.log('canSubmit:', canSubmit); // 输出 canSubmit 的值进行调试

    return (
        <Container maxWidth="lg" sx={{ py: 4 }} style={{ backgroundColor: '#f0f2f5' }}>
            {/* 返回按钮和课程信息 */}
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => router.push(`/student/course/${assignment.course_id}`)}
                    sx={{ mb: 2 }}
                >
                    返回课程
                </Button>
            </Box>
            {/* 作业详情卡片 */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        {assignment.title}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                        截止时间：{new Date(assignment.deadline).toLocaleString()}
                        {isDeadlinePassed &&
                            <Typography component="span" color="error" sx={{ ml: 2 }}>
                                已截止
                            </Typography>
                        }
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {assignment.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        满分：{assignment.max_score}分
                    </Typography>
                </CardContent>
            </Card>

            {/* 提交状态和评分 */}
            {submission && (
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            提交状态
                        </Typography>
                        <Stack spacing={2}>
                            <Typography>
                                状态：{
                                    {
                                        'submitted': '已提交',
                                        'graded': '已批改',
                                        'returned': '已退回'
                                    }[submission.status]
                                }
                            </Typography>

                            {/* 提交内容 */}
                            {submission.content && (
                                <Box>
                                    <Typography variant="subtitle1" gutterBottom>
                                        提交内容：
                                    </Typography>
                                    <Typography
                                        sx={{
                                            bgcolor: 'grey.100',
                                            p: 2,
                                            borderRadius: 1,
                                            whiteSpace: 'pre-wrap'
                                        }}
                                    >
                                        {submission.content}
                                    </Typography>
                                </Box>
                            )}

                            {/* 提交文件 */}
                            {submission.files && submission.files.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle1" gutterBottom>
                                        提交文件：
                                    </Typography>
                                    <Stack spacing={1}>
                                        {submission.files.map((file, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    p: 1,
                                                    bgcolor: 'grey.50',
                                                    borderRadius: 1
                                                }}
                                            >
                                                {/* 文件图标 */}
                                                {file.type.includes('image') ? (
                                                    <img
                                                        src={file.url}
                                                        alt={file.name}
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                            objectFit: 'cover',
                                                            borderRadius: 4
                                                        }}
                                                    />
                                                ) : (
                                                    <InsertDriveFile sx={{ fontSize: 40 }} />
                                                )}

                                                {/* 文件信息 */}
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="body2">
                                                        {file.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {(file.size / 1024).toFixed(2)} KB • {
                                                            file.type.split('/')[1].toUpperCase()
                                                        }
                                                    </Typography>
                                                </Box>

                                                {/* 下载按钮 */}
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Download />}
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    下载
                                                </Button>

                                                {/* 预览按钮（仅图片和PDF） */}
                                                {(file.type.includes('image') || file.type === 'application/pdf') && (
                                                    <IconButton
                                                        onClick={() => {
                                                            setPreviewImage(file.url);
                                                            setPreviewVisible(true);
                                                        }}
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            {/* 评分和反馈 */}
                            {submission.score !== null && (
                                <Typography>
                                    得分：{submission.score} / {assignment.max_score}
                                </Typography>
                            )}
                            {submission.feedback && (
                                <>
                                    <Divider />
                                    <Typography variant="h6">教师反馈</Typography>
                                    <Typography>{submission.feedback}</Typography>
                                </>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {/* 提交表单 */}
            {canSubmit && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            提交作业
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
                        )}

                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            label="作业内容"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <Box sx={{ mb: 3 }}>
                            <Upload.Dragger
                                multiple
                                fileList={files}
                                onChange={handleFileUpload}
                                beforeUpload={beforeUpload}
                                onPreview={handlePreview}
                                showUploadList={{
                                    showDownloadIcon: true,
                                    showRemoveIcon: true,
                                    showPreviewIcon: true,
                                }}
                                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mp3"
                                style={{
                                    padding: '20px',
                                    background: '#fafafa',
                                    border: '1px dashed #d9d9d9'
                                }}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    点击或拖拽文件到此区域上传
                                </p>
                                <p className="ant-upload-hint">
                                    支持单个或批量上传，文件大小不超过50MB
                                </p>
                            </Upload.Dragger>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={!canSubmit || (!content.trim() && files.length === 0)}
                            >
                                提交作业
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* 添加预览模态框 */}
            <Modal
                open={previewVisible}
                onClose={() => setPreviewVisible(false)}
                aria-labelledby="file-preview"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 2,
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}
                >
                    {previewImage.endsWith('.pdf') ? (
                        <iframe
                            src={previewImage}
                            style={{
                                width: '100%',
                                height: '80vh',
                                border: 'none'
                            }}
                            title="PDF预览"
                        />
                    ) : (
                        <img
                            alt="preview"
                            src={previewImage}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                objectFit: 'contain'
                            }}
                        />
                    )}
                </Box>
            </Modal>
        </Container>
    );
} 