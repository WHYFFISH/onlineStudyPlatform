import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function POST(request, { params }) {
    try {
        // 等待动态路由参数
        const id = await params.id;
        const courseId = parseInt(id);
        const userId = 1; // TODO: 从session获取用户ID

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