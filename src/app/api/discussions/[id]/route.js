import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function GET(request, { params }) {
    try {
        const id = params?.id;
        // 获取讨论详情
        const [discussion] = await query(`
            SELECT 
                d.*,
                u.name as author_name,
                u.avatar as author_avatar,
                c.title as course_name,
                COALESCE(d.likes, 0) as likes,
                (SELECT COUNT(*) FROM DiscussionReplies WHERE discussion_id = d.id) as reply_count
            FROM Discussions d
            JOIN Users u ON d.user_id = u.id
            JOIN Courses c ON d.course_id = c.id
            WHERE d.id = ?
        `, [id]);

        if (!discussion) {
            return NextResponse.json(
                { error: '未找到讨论' },
                { status: 404 }
            );
        }

        // 获取评论列表
        const comments = await query(`
            SELECT 
                r.*,
                u.name as author_name,
                u.avatar as author_avatar,
                COALESCE(r.likes, 0) as likes
            FROM DiscussionReplies r
            JOIN Users u ON r.user_id = u.id
            WHERE r.discussion_id = ?
            ORDER BY r.created_at ASC
        `, [id]);

        return NextResponse.json({
            ...discussion,
            comments: comments
        });

    } catch (error) {
        console.error('获取讨论详情失败:', error);
        return NextResponse.json(
            { error: '获取讨论详情失败' },
            { status: 500 }
        );
    }
} 