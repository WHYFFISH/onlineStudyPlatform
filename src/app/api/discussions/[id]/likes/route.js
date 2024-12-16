import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function POST(request, { params }) {
    try {
        const id = params?.id;
        const userId = 1; // 暂时硬编码用户ID
        const { type, targetId } = await request.json();

        // 更新点赞数
        if (type === 'reply') {
            await query(`
                UPDATE DiscussionReplies 
                SET likes = COALESCE(likes, 0) + 1
                WHERE id = ?
            `, [targetId]);

            // 获取最新点赞数
            const [{ likes }] = await query(`
                SELECT COALESCE(likes, 0) as likes 
                FROM DiscussionReplies 
                WHERE id = ?
            `, [targetId]);

            return NextResponse.json({ likes });
        } else {
            await query(`
                UPDATE Discussions 
                SET likes = COALESCE(likes, 0) + 1
                WHERE id = ?
            `, [id]);

            // 获取最新点赞数
            const [{ likes }] = await query(`
                SELECT COALESCE(likes, 0) as likes 
                FROM Discussions 
                WHERE id = ?
            `, [id]);

            return NextResponse.json({ likes });
        }

    } catch (error) {
        console.error('处理点赞失败:', error);
        return NextResponse.json(
            { error: '处理点赞失败' },
            { status: 500 }
        );
    }
} 