import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function GET(request) {
    try {
        // TODO: 从session或token中获取用户ID
        const userId = 1; // 临时硬编码，实际应该从认证中获取

        const courses = await query(`
            SELECT DISTINCT
                c.id,
                c.title,
                c.description,
                c.thumbnail,
                c.total_hours,
                u.name as instructor_name,
                ROUND((e.completed_hours / c.total_hours * 100), 2) as progress,
                e.completed_hours,
                e.last_studied_at,
                e.enrollment_date
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            JOIN users u ON c.instructor_id = u.id
            WHERE e.user_id = ?
            ORDER BY e.last_studied_at DESC
        `, [userId]);

        return NextResponse.json(courses);
    } catch (error) {
        console.error('获取已注册课程失败:', error);
        return NextResponse.json(
            { error: '获取已注册课程失败' },
            { status: 500 }
        );
    }
} 