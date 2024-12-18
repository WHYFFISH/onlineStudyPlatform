import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function POST(request, { params }) {
    try {
        const { id } = params;
        const courseId = parseInt(id);

        // 解析请求体
        const data = await request.json();
        const userId = data.userId;

        if (!courseId || !userId) {
            return NextResponse.json(
                { error: '课程ID和用户ID是必需的' },
                { status: 400 }
            );
        }

        // 更新上次学习时间
        await query(
            `UPDATE enrollments 
             SET last_studied_at = NOW() 
             WHERE course_id = ? AND user_id = ?`,
            [courseId, userId]
        );

        // 获取更新后的学习时间
        const [enrollment] = await query(
            `SELECT last_studied_at 
             FROM enrollments 
             WHERE course_id = ? AND user_id = ?`,
            [courseId, userId]
        );

        return NextResponse.json({
            success: true,
            message: '更新学习时间成功',
            last_studied_at: enrollment?.last_studied_at
        });
    } catch (error) {
        console.error('更新学习时间失败:', error);
        return NextResponse.json(
            { error: '更新学习时间失败' },
            { status: 500 }
        );
    }
} 