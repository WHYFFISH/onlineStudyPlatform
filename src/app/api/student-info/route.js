import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';
import OSS from 'ali-oss';

export async function GET(request) {
    try {
        const userId = request.headers.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: '未提供用户ID' },
                { status: 400 }
            );
        }

        // 获取学生基本信息
        const [student] = await query(`
            SELECT 
                id,
                name,
                signature,
                student_number as student_number,
                email,
                avatar
            FROM users
            WHERE id = ? AND role = 'student'
        `, [userId]);

        if (!student) {
            return NextResponse.json(
                { error: '未找到学生信息' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: student.id,
            name: student.name,
            signature: student.signature || '',
            student_number: student.student_number,
            email: student.email,
            avatarUrl: `https://szu-mooc.oss-cn-shenzhen.aliyuncs.com/${student.avatar}`
        });

    } catch (error) {
        console.error('获取学生信息失败:', error);
        return NextResponse.json(
            { error: '获取学生信息失败' },
            { status: 500 }
        );
    }
}
