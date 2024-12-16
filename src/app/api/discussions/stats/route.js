import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function GET(request) {
    try {
        const userId = 1; // 暂时硬编码用户ID

        // 获取用户的讨论统计
        const stats = await query(`
            SELECT
                (SELECT COUNT(*) FROM Discussions WHERE user_id = ?) as post_count,
                (SELECT COUNT(*) FROM DiscussionReplies WHERE user_id = ?) as reply_count,
                (SELECT COUNT(*) 
                 FROM DiscussionReplies r
                 JOIN Discussions d ON r.discussion_id = d.id
                 WHERE d.user_id = ?) as received_replies
        `, [userId, userId, userId]);

        return NextResponse.json(stats[0]);

    } catch (error) {
        console.error('获取讨论统计失败:', error);
        return NextResponse.json(
            { error: '获取讨论统计失败' },
            { status: 500 }
        );
    }
} 