import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function POST(request) {
    try {
        const { courseId, userId } = await request.json();

        // 检查是否已经注册
        const [existing] = await query(
            'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
            [userId, courseId]
        );

        if (existing) {
            return NextResponse.json(
                { error: '已经注册过该课程' },
                { status: 400 }
            );
        }

        // 注册课程
        await query(
            `INSERT INTO enrollments (
                user_id, 
                course_id, 
                completed_hours,
                enrollment_date
            ) VALUES (?, ?, 0, NOW())`,
            [userId, courseId]
        );

        // 更新课程的注册人数和收藏人数
        await query(
            'UPDATE courses SET registration_count = registration_count + 100,likes = likes + 1 WHERE id = ?',
            [courseId]
        );

        return NextResponse.json({ message: '注册成功' });

    } catch (error) {
        console.error('注册课程失败:', error);
        return NextResponse.json(
            { error: '注册课程失败' },
            { status: 500 }
        );
    }
} 