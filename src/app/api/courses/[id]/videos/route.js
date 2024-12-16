import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function POST(request, { params }) {
    try {
        const courseId = parseInt(params.id);
        const data = await request.json();

        // 插入视频记录
        const result = await query(
            `INSERT INTO course_videos 
             (course_id, name, url, path, size, type, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [courseId, data.name, data.url, data.path, data.size, data.type]
        );

        // 获取插入的记录
        const [video] = await query(
            'SELECT * FROM course_videos WHERE id = ?',
            [result.insertId]
        );

        return NextResponse.json(video);
    } catch (error) {
        console.error('保存视频信息失败:', error);
        return NextResponse.json(
            { error: '保存视频信息失败' },
            { status: 500 }
        );
    }
}

export async function GET(request, { params }) {
    try {
        const courseId = params.id;

        const videos = await query(
            'SELECT * FROM course_videos WHERE course_id = ? ORDER BY created_at DESC',
            [courseId]
        );

        return NextResponse.json({ videos });
    } catch (error) {
        console.error('获取视频列表失败:', error);
        return NextResponse.json(
            { error: '获取视频列表失败' },
            { status: 500 }
        );
    }
} 