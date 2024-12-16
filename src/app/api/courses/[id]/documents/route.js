import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function POST(request, { params }) {
    try {
        const courseId = params.id;
        const data = await request.json();

        // 插入文档记录
        const result = await query(
            `INSERT INTO course_documents 
             (course_id, name, url, path, size, type, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [courseId, data.name, data.url, data.path, data.size, data.type]
        );

        // 获取插入的记录
        const [document] = await query(
            'SELECT * FROM course_documents WHERE id = ?',
            [result.insertId]
        );

        return NextResponse.json(document);
    } catch (error) {
        console.error('保存文档信息失败:', error);
        return NextResponse.json(
            { error: '保存文档信息失败' },
            { status: 500 }
        );
    }
}

export async function GET(request, { params }) {
    try {
        const courseId = params.id;

        const documents = await query(
            'SELECT * FROM course_documents WHERE course_id = ? ORDER BY created_at DESC',
            [courseId]
        );

        return NextResponse.json({ documents });
    } catch (error) {
        console.error('获取文档列表失败:', error);
        return NextResponse.json(
            { error: '获取文档列表失败' },
            { status: 500 }
        );
    }
} 