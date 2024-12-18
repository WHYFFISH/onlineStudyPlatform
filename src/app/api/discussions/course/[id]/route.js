import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function GET(request, { params }) {
    try {
        const courseId = params.id;

        // 获取课程的讨论列表
        const discussions = await query(`
            SELECT 
                d.id,
                d.title,
                d.content,
                d.created_at,
                d.reply_count,
                u.name as author_name,
                u.avatar as author_avatar
            FROM Discussions d
            JOIN Users u ON d.user_id = u.id
            WHERE d.course_id = ?
            ORDER BY d.created_at DESC
        `, [courseId]);

        return NextResponse.json({
            discussions: discussions.map(discussion => ({
                ...discussion,
                content: discussion.content.substring(0, 200) + (discussion.content.length > 200 ? '...' : ''),
                created_at: new Date(discussion.created_at).toISOString(),
            }))
        });

    } catch (error) {
        console.error('获取课程讨论列表失败:', error);
        return NextResponse.json(
            { error: '获取课程讨论列表失败' },
            { status: 500 }
        );
    }
} 