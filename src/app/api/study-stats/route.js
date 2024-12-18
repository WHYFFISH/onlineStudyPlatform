import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function GET(request) {
    try {
        const userId = request.headers.get('userId');

        // 添加调试日志
        console.log('Fetching study stats for user:', userId);

        // 获取最近7天的学习时长
        const studyTimeQuery = `
            SELECT 
                DATE(last_accessed_at) as date,
                COALESCE(
                    SUM(last_position) / 3600, -- 将秒转换为小时
                    0
                ) as hours
            FROM learningprogress
            WHERE user_id = ?
            AND last_accessed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(last_accessed_at)
            ORDER BY date
        `;

        const studyTime = await query(studyTimeQuery, [userId]);
        console.log('Study time query results:', studyTime);

        // 确保有过去7天的数据
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        const studyTimeMap = new Map(
            studyTime.map(day => [day.date, parseFloat(day.hours) || 0])
        );

        const completeStudyTime = last7Days.map(date => ({
            date,
            hours: studyTimeMap.get(date) || 0
        }));

        // 获取课程进度
        const progress = await query(`
            SELECT 
                c.title as name,
                ROUND((e.completed_hours / c.total_hours * 100), 2) as progress
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = ?
            AND (e.completed_hours / c.total_hours * 100) < 100
            ORDER BY e.last_studied_at DESC
            LIMIT 5
        `, [userId]);

        // 获取未来的截止日期
        const deadlines = await query(`
            SELECT 
                a.title,
                a.deadline as date,
                c.title as courseName
            FROM assignments a
            JOIN courses c ON a.course_id = c.id
            JOIN enrollments e ON c.id = e.course_id
            WHERE e.user_id = ?
            AND a.deadline > NOW()
            ORDER BY a.deadline
            LIMIT 10
        `, [userId]);

        // 获取总体学习统计
        const [stats] = await query(`
            SELECT 
                COUNT(DISTINCT e.course_id) as total_courses,
                COALESCE(SUM(e.completed_hours), 0) as total_hours,
                COALESCE(AVG((e.completed_hours / c.total_hours * 100)), 0) as avg_progress,
                COUNT(DISTINCT CASE WHEN (e.completed_hours / c.total_hours * 100) = 100 
                    THEN e.course_id END) as completed_courses
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = ?
        `, [userId]);

        const response = {
            studyTime: completeStudyTime,
            progress: progress.map(course => ({
                ...course,
                progress: Math.round(parseFloat(course.progress) || 0)
            })),
            deadlines: deadlines.map(deadline => ({
                ...deadline,
                date: new Date(deadline.date).toISOString()
            })),
            stats: {
                totalCourses: parseInt(stats.total_courses) || 0,
                totalHours: Math.round(parseFloat(stats.total_hours) || 0),
                avgProgress: Math.round(parseFloat(stats.avg_progress) || 0),
                completedCourses: parseInt(stats.completed_courses) || 0
            }
        };

        console.log('Final response:', response);
        return NextResponse.json(response);
    } catch (error) {
        console.error('获取学习统计失败:', error);
        return NextResponse.json(
            { error: '获取学习统计失败' },
            { status: 500 }
        );
    }
} 