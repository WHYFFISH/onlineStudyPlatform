import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function GET(request) {
    try {
        const userId = request.headers.get('userId');

        // 获取与用户相关的讨论（用户参与的课程的讨论）
        const discussions = await query(`
            SELECT 
                d.id,
                d.title,
                d.content,
                d.created_at,
                d.reply_count,
                u.name as author_name,
                u.avatar as author_avatar,
                c.title as course_name
            FROM Discussions d
            JOIN Users u ON d.user_id = u.id
            JOIN Courses c ON d.course_id = c.id
            WHERE d.course_id IN (
                SELECT course_id 
                FROM Enrollments 
                WHERE user_id = ?
            )
            ORDER BY d.created_at DESC
            LIMIT 10
        `, [userId]);

        return NextResponse.json({
            discussions: discussions.map(discussion => ({
                ...discussion,
                content: discussion.content.substring(0, 200) + (discussion.content.length > 200 ? '...' : ''),
                created_at: new Date(discussion.created_at).toISOString(),
            }))
        });

    } catch (error) {
        console.error('获取讨论列表失败:', error);
        return NextResponse.json(
            { error: '获取讨论列表失败' },
            { status: 500 }
        );
    }
} 