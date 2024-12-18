'use client';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
    Announcement,
    Assessment,
    Assignment,
    School,
    Forum,
    VideoLibrary,
    Description,
} from '@mui/icons-material';

const menuItems = [
    { icon: <Announcement />, text: '公告' },
    { icon: <Assessment />, text: '评分标准' },
    { icon: <Assignment />, text: '作业' },
    { icon: <School />, text: '考试' },
    { icon: <Forum />, text: '讨论区' },
    { icon: <VideoLibrary />, text: '视频' },
    { icon: <Description />, text: '文档' },
];

export default function CourseMenu({ selected, onSelect }) {
    return (
        <Box sx={{
            width: '100%',
            bgcolor: 'background.paper',
            py: 1.5
        }}>
            <List sx={{ px: 1 }}>
                {menuItems.map((item, index) => (
                    <ListItem
                        button
                        key={index}
                        selected={selected === index}
                        onClick={() => onSelect(index)}
                        sx={{
                            py: 1.5,
                            px: 2,
                            borderRadius: 1.5,
                            mb: 0.5,
                            transition: 'all 0.2s',
                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                '& .MuiListItemIcon-root': {
                                    color: 'white'
                                },
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                }
                            },
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                                transform: 'translateX(4px)'
                            }
                        }}
                    >
                        <ListItemIcon sx={{
                            minWidth: 36,
                            color: selected === index ? 'inherit' : 'action.active'
                        }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                                sx: {
                                    fontSize: '0.9rem',
                                    fontWeight: selected === index ? 500 : 400
                                }
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
} 