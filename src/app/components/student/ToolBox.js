'use client';
import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Card,
    Typography,
} from '@mui/material';
import {
    Dashboard,
    School,
    Forum,
    AssignmentLate,
    History,
    Note,
    Star,
    ErrorOutline,
} from '@mui/icons-material';

const tools = [
    {
        id: 'dashboard',
        name: '学习概览',
        icon: <Dashboard />
    },
    {
        id: 'my-courses',
        name: '我的课程',
        icon: <School />
    },
    {
        id: 'discuss',
        name: '讨论专区',
        icon: <Forum />
    },
    {
        id: 'assignments',
        name: '作业管理',
        icon: <AssignmentLate />
    },
    {
        id: 'learning-history',
        name: '学习历史',
        icon: <History />
    },
    {
        id: 'learning-notes',
        name: '学习笔记',
        icon: <Note />
    },
    {
        id: 'favorites',
        name: '我的收藏',
        icon: <Star />
    },
    {
        id: 'my-mistakes',
        name: '我的错题',
        icon: <ErrorOutline />
    }
];

export default function ToolBox({ currentTool, onToolChange }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* 学习工具框 */}
            <Card>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        学习工具
                    </Typography>
                    <List>
                        {tools.map((tool) => (
                            <ListItem
                                key={tool.id}
                                button
                                selected={currentTool === tool.id}
                                onClick={() => onToolChange(tool.id)}
                                sx={{
                                    borderRadius: 1,
                                    mb: 1,
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'white',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: currentTool === tool.id ? 'white' : 'inherit',
                                    }}
                                >
                                    {tool.icon}
                                </ListItemIcon>
                                <ListItemText primary={tool.name} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Card>
        </Box>
    );
}
