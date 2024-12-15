import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function GET(request, { params }) {
    try {
        const courseId = params.id;
        const userId = 1; // TODO: 从session获取用户ID

        // 获取章节列表及其资源
        const chapters = await query(`
            SELECT 
                ch.*,
                COUNT(DISTINCT r.id) as total_resources,
                COUNT(DISTINCT CASE WHEN lp.completed = TRUE THEN r.id END) as completed_resources
            FROM chapters ch
            LEFT JOIN resources r ON ch.id = r.chapter_id
            LEFT JOIN learningprogress lp ON r.id = lp.resource_id AND lp.user_id = ?
            WHERE ch.course_id = ?
            GROUP BY ch.id
            ORDER BY ch.sort_order
        `, [userId, courseId]);

        // 获取每个章节的资源
        for (let chapter of chapters) {
            const resources = await query(`
                SELECT 
                    r.*,
                    lp.completed,
                    lp.progress,
                    lp.last_position
                FROM resources r
                LEFT JOIN learningprogress lp ON r.id = lp.resource_id AND lp.user_id = ?
                WHERE r.chapter_id = ?
                ORDER BY r.sort_order
            `, [userId, chapter.id]);

            chapter.resources = resources;
        }

        return NextResponse.json(chapters);
    } catch (error) {
        console.error('获取章节列表失败:', error);
        return NextResponse.json(
            { error: '获取章节列表失败' },
            { status: 500 }
        );
    }
} 