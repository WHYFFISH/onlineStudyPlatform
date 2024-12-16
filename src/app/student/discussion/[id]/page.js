'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Avatar,
    Button,
    TextField,
    Divider,
    IconButton,
    Stack,
} from '@mui/material';
import {
    ArrowBack,
    ThumbUp,
    Reply,
    School,
} from '@mui/icons-material';

export default function DiscussionDetail() {
    const params = useParams();
    const router = useRouter();
    const [discussion, setDiscussion] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [replyTo, setReplyTo] = useState(null);

    // 获取讨论详情
    useEffect(() => {
        const fetchDiscussionDetail = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/discussions/${params.id}`);
                if (!response.ok) {
                    throw new Error('获取讨论详情失败');
                }
                const data = await response.json();
                setDiscussion(data);
                setComments(data.comments || []);
            } catch (err) {
                console.error('获取讨论详情失败:', err);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchDiscussionDetail();
        }
    }, [params.id]);

    const handleSubmitReply = async () => {
        if (!replyContent.trim()) return;

        try {
            const response = await fetch(`/api/discussions/${params.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: replyContent,
                    reply_to: replyTo?.id
                }),
            });

            if (!response.ok) {
                throw new Error('发表评论失败');
            }

            const newComment = await response.json();
            setComments(prevComments => [...prevComments, newComment]);
            setReplyContent('');
            setReplyTo(null);
        } catch (err) {
            console.error('发表评论失败:', err);
        }
    };

    // 处理点赞
    const handleLike = async (type, targetId = null) => {
        try {
            const response = await fetch(`/api/discussions/${params.id}/likes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: type,
                    targetId: targetId
                }),
            });

            if (!response.ok) {
                throw new Error('点赞失败');
            }

            const { likes } = await response.json();

            if (type === 'reply') {
                // 更新评论的点赞数
                setComments(prevComments =>
                    prevComments.map(comment =>
                        comment.id === targetId
                            ? { ...comment, likes }
                            : comment
                    )
                );
            } else {
                // 更新讨论的点赞数
                setDiscussion(prev => ({ ...prev, likes }));
            }
        } catch (err) {
            console.error('点赞失败:', err);
        }
    };

    // 处理回复评论
    const handleReply = (comment) => {
        setReplyTo(comment);
        document.querySelector('#comment-input')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) {
        return <Typography>加载中...</Typography>;
    }

    if (!discussion) {
        return <Typography>未找到讨论内容</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }} style={{ backgroundColor: '#f0f2f5' }}>
            {/* 返回按钮 */}
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => router.back()}
                    sx={{ mb: 2 }}
                >
                    返回
                </Button>

                {/* 课程信息 */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'text.secondary'
                }}>
                    <School fontSize="small" />
                    <Typography
                        variant="body2"
                        component="span"
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                color: 'primary.main'
                            }
                        }}
                        onClick={() => {
                            window.open(`/student/course/${discussion.course_id}`, '_blank');
                        }}
                    >
                        {discussion.course_name}
                    </Typography>
                </Box>
            </Box>

            {/* 讨论主题 */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Avatar
                            src={discussion.author_avatar}
                            sx={{ width: 48, height: 48 }}
                        />
                        <Box>
                            <Typography variant="h6">{discussion.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {discussion.author_name} · {new Date(discussion.created_at).toLocaleString()}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        {discussion.content}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            startIcon={<ThumbUp />}
                            variant="outlined"
                            size="small"
                            onClick={() => handleLike('discussion')}
                        >
                            点赞 ({discussion.likes || 0})
                        </Button>
                        <Button
                            startIcon={<Reply />}
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                // 创建一个虚拟的评论对象，包含作者信息
                                const authorComment = {
                                    id: null,  // 回复主题时不需要评论ID
                                    author_name: discussion.author_name,
                                };
                                handleReply(authorComment);
                            }}
                        >
                            回复
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* 评论区 */}
            <Box>
                <Typography variant="h6" gutterBottom>
                    评论 ({comments.length})
                </Typography>

                {/* 发表评论 */}
                <Card sx={{ mb: 3 }} id="comment-input">
                    <CardContent>
                        {replyTo && (
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    回复 {replyTo.author_name}:
                                </Typography>
                                <Button
                                    size="small"
                                    onClick={() => setReplyTo(null)}
                                >
                                    取消回复
                                </Button>
                            </Box>
                        )}
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder={replyTo ? `回复 ${replyTo.author_name}...` : "写下你的评论..."}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmitReply}
                                disabled={!replyContent.trim()}
                            >
                                {replyTo ? '回复' : '发表评论'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* 评论列表 */}
                <Stack spacing={2}>
                    {comments.map((comment, index) => (
                        <Card key={`comment-${comment.id}-${index}`}>
                            <CardContent>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Avatar
                                        src={comment.author_avatar}
                                        sx={{ width: 40, height: 40 }}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="subtitle2">
                                                {comment.author_name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(comment.created_at).toLocaleString()}
                                            </Typography>
                                        </Box>
                                        {comment.reply_to && (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 1 }}
                                            >
                                                回复 @{comment.reply_to_name}
                                            </Typography>
                                        )}
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            {comment.content}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Button
                                                size="small"
                                                startIcon={<ThumbUp />}
                                                onClick={() => handleLike('reply', comment.id)}
                                            >
                                                点赞 ({comment.likes || 0})
                                            </Button>
                                            <Button
                                                size="small"
                                                startIcon={<Reply />}
                                                onClick={() => handleReply(comment)}
                                            >
                                                回复
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>

                {comments.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="text.secondary">
                            暂无评论，来发表第一条评论吧
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
} 