'use client';
import { useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, progress }) => {
    const radius = outerRadius * 1.2; // 增加一点标签距离
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // 将课程名称按固定长度分行
    const nameLines = name.match(/.{1,5}/g) || [];

    return (
        <text
            x={x}
            y={y}
            fill="#666"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize="12"
        >
            {nameLines.map((line, index) => (
                <tspan
                    key={index}
                    x={x}
                    dy={index === 0 ? 0 : '1.2em'}
                    fontSize="15"
                >
                    {line}
                </tspan>
            ))}
            <tspan
                x={x}
                dy="1.2em"
                fontSize="11"
            >
                {progress}%
            </tspan>
        </text>
    );
};

export default function LearningStats({
    courseProgress,
    deadlines = []
}) {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // 确保课程进度数据的唯一性
    const uniqueCourseProgress = courseProgress.map((course, index) => ({
        ...course,
        id: `course-${index}`,
        progress: Math.round(parseFloat(course.progress) || 0)
    }));

    // 计算平均完成进度
    const averageProgress = uniqueCourseProgress.reduce((acc, curr) => acc + curr.progress, 0) /
        (uniqueCourseProgress.length || 1);

    // 格式化日期
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <Box>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
                <Tab label="学习概览" />
                <Tab label="截止日期" />
            </Tabs>

            {/* 学习概览 */}
            {tabValue === 0 && (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    课程进度
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={uniqueCourseProgress}
                                            dataKey="progress"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={renderCustomizedLabel}
                                            labelLine={{
                                                stroke: '#999',
                                                strokeWidth: 1,
                                                strokeDasharray: '3,3', // 可选：使用虚线
                                                offsetRadius: 10        // 调整引导线起点距离饼图的距离
                                            }}
                                        >
                                            {uniqueCourseProgress.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${entry.id}-${entry.name}-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name, props) => [
                                                `${value}%`,
                                                props.payload.name
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', minHeight: 368 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    学习数据
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body1">
                                        平均完成度：{Math.round(averageProgress)}%
                                    </Typography>
                                    <Typography variant="body1">
                                        待完成作业：{deadlines.length} 项
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* 截止日期列表 */}
            {tabValue === 1 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            作业截止日期
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>任务名称</TableCell>
                                        <TableCell>所属课程</TableCell>
                                        <TableCell align="right">截止日期</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {deadlines.map((deadline, index) => (
                                        <TableRow
                                            key={`deadline-${deadline.title}-${deadline.date}-${index}`}
                                        >
                                            <TableCell component="th" scope="row">
                                                {deadline.title}
                                            </TableCell>
                                            <TableCell>
                                                {deadline.courseName}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatDate(deadline.date)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {deadlines.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">
                                                暂无待完成任务
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}