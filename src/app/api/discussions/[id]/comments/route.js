import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function POST(request, { params }) {
    try {
        const id = params?.id;
        const userId = 1; // 暂时硬编码用户ID
        const { content, reply_to } = await request.json();

        if (!content?.trim()) {
            return NextResponse.json(
                { error: '评论内容不能为空' },
                { status: 400 }
            );
        }

        // 插入评论
        const result = await query(`
            INSERT INTO DiscussionReplies (
                discussion_id,
                user_id,
                content,
                reply_to,
                created_at,
                likes
            ) VALUES (?, ?, ?, ?, NOW(), 0)
        `, [id, userId, content, reply_to || null]);

        // 获取新插入的评论详情（包括回复信息）
        const [newComment] = await query(`
            SELECT 
                r.*,
                u.name as author_name,
                u.avatar as author_avatar,
                ru.name as reply_to_name
            FROM DiscussionReplies r
            JOIN Users u ON r.user_id = u.id
            LEFT JOIN DiscussionReplies rr ON r.reply_to = rr.id
            LEFT JOIN Users ru ON rr.user_id = ru.id
            WHERE r.id = ?
        `, [result.insertId]);

        // 更新讨论的回复数
        await query(`
            UPDATE Discussions 
            SET reply_count = COALESCE(reply_count, 0) + 1 
            WHERE id = ?
        `, [id]);

        return NextResponse.json(newComment);

    } catch (error) {
        console.error('发表评论失败:', error);
        return NextResponse.json(
            { error: '发表评论失败' },
            { status: 500 }
        );
    }
} 