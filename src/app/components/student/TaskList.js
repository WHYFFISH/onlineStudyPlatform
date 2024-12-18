'use client';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Pagination,
    Button
} from '@mui/material';
import {
    Assignment,
    VideoLibrary,
    Description,
    QuestionAnswer,
    Edit,
    ExpandMore
} from '@mui/icons-material';
import { useState } from 'react';

const getTaskIcon = (type) => {
    switch (type) {
        case 'assignment':
            return <Assignment color="primary" />;
        case 'video':
            return <VideoLibrary color="primary" />;
        case 'document':
            return <Description color="primary" />;
        case 'discussion':
            return <QuestionAnswer color="primary" />;
        case 'exercise':
            return <Edit color="primary" />;
        default:
            return <Assignment color="primary" />;
    }
};

const getTaskStatus = (task) => {
    const now = new Date();
    const deadline = new Date(task.deadline);

    if (deadline < now) {
        return <Chip label="已逾期" color="error" size="small" />;
    }
    if (deadline - now < 24 * 60 * 60 * 1000) { // 24小时内
        return <Chip label="即将截止" color="warning" size="small" />;
    }
    return <Chip label="进行中" color="primary" size="small" />;
};

export default function TaskList({ tasks = [] }) {
    const [page, setPage] = useState(1);
    const tasksPerPage = 5;

    // 确保tasks是数组
    const taskArray = Array.isArray(tasks) ? tasks : [];
    const totalPages = Math.ceil(taskArray.length / tasksPerPage);

    // 获取当前页的任务
    const getCurrentPageTasks = () => {
        const start = (page - 1) * tasksPerPage;
        const end = start + tasksPerPage;
        return taskArray.slice(start, end);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    待完成任务
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    共 {taskArray.length} 项任务
                </Typography>
            </Box>

            <List>
                {getCurrentPageTasks().map((task, index) => (
                    <ListItem
                        key={`${task.type}-${task.id}-${task.courseName}-${index}`}
                        sx={{
                            mb: 1,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            '&:hover': {
                                bgcolor: 'action.hover',
                            },
                        }}
                    >
                        <ListItemIcon>
                            {getTaskIcon(task.type)}
                        </ListItemIcon>
                        <ListItemText
                            primary={task.title}
                            secondary={
                                <Box
                                    component="span"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Typography
                                        component="span"
                                        variant="body2"
                                    >
                                        {task.courseName}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                    >
                                        •
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                    >
                                        截止日期: {new Date(task.deadline).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            }
                        />
                        {getTaskStatus(task)}
                    </ListItem>
                ))}
                {taskArray.length === 0 && (
                    <ListItem>
                        <ListItemText
                            primary={
                                <Typography color="text.secondary">
                                    暂无待完成任务
                                </Typography>
                            }
                        />
                    </ListItem>
                )}
            </List>

            {taskArray.length > tasksPerPage && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    pt: 2
                }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="small"
                    />
                </Box>
            )}
        </Box>
    );
} 