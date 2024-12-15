import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

// 获取所有课程
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const keyword = searchParams.get('keyword');
        const status = searchParams.get('status');
        const instructor_id = searchParams.get('instructor_id');

        let sqlQuery = `
            SELECT 
                c.id,
                c.title,
                c.description,
                c.thumbnail,
                c.total_hours,
                c.status,
                c.price,
                c.created_at,
                c.updated_at,
                c.author,
                c.likes,
                u.name as instructor_name,
                u.id as instructor_id,
                (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as registration_count
            FROM courses c
            LEFT JOIN users u ON c.instructor_id = u.id
            WHERE 1=1
        `;

        const queryParams = [];

        // 添加搜索条件
        if (keyword) {
            sqlQuery += ` AND (c.title LIKE ? OR c.description LIKE ? OR c.author LIKE ?)`;
            queryParams.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }

        if (status) {
            sqlQuery += ` AND c.status = ?`;
            queryParams.push(status);
        }

        if (instructor_id) {
            sqlQuery += ` AND c.instructor_id = ?`;
            queryParams.push(instructor_id);
        }

        sqlQuery += ` ORDER BY c.updated_at DESC`;

        const courses = await query(sqlQuery, queryParams);
        return NextResponse.json(courses);
    } catch (error) {
        console.error('获取课程列表失败:', error);
        return NextResponse.json(
            { error: '获取课程列表失败' },
            { status: 500 }
        );
    }
}

// 创建新课程
export async function POST(request) {
    try {
        const {
            title,
            description,
            thumbnail,
            total_hours,
            instructor_id,
            price,
            status = 'draft'  // 默认为草稿状态
        } = await request.json();

        if (!title || !instructor_id) {
            return NextResponse.json(
                { error: '课程标题和教师ID不能为空' },
                { status: 400 }
            );
        }

        // 验证教师身份
        const [instructor] = await query(
            'SELECT role FROM users WHERE id = ?',
            [instructor_id]
        );

        if (!instructor || instructor.role !== 'teacher') {
            return NextResponse.json(
                { error: '只有教师才能创建课程' },
                { status: 403 }
            );
        }

        const result = await query(
            `INSERT INTO courses (
                title, 
                description, 
                thumbnail, 
                total_hours,
                instructor_id,
                price,
                status,
                author
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                description,
                thumbnail,
                total_hours || 0,
                instructor_id,
                price || 0.00,
                status,
                instructor.name  // 使用教师名称作为作者
            ]
        );

        // 获取新创建的课程完整信息
        const [newCourse] = await query(`
            SELECT 
                c.*,
                u.name as instructor_name
            FROM courses c
            LEFT JOIN users u ON c.instructor_id = u.id
            WHERE c.id = ?
        `, [result.insertId]);

        return NextResponse.json(newCourse, { status: 201 });

    } catch (error) {
        console.error('创建课程失败:', error);
        return NextResponse.json(
            { error: '创建课程失败' },
            { status: 500 }
        );
    }
}

// 更新课程
export async function PUT(request) {
    try {
        const {
            id,
            title,
            description,
            thumbnail,
            total_hours,
            instructor_id,
            price,
            status
        } = await request.json();

        if (!id || !title) {
            return NextResponse.json(
                { error: '课程ID和标题不能为空' },
                { status: 400 }
            );
        }

        // 验证教师身份
        if (instructor_id) {
            const [instructor] = await query(
                'SELECT role FROM users WHERE id = ?',
                [instructor_id]
            );

            if (!instructor || instructor.role !== 'teacher') {
                return NextResponse.json(
                    { error: '指定的用户不是教师' },
                    { status: 403 }
                );
            }
        }

        // 验证是否为课程的创建者
        const [course] = await query(
            'SELECT instructor_id FROM courses WHERE id = ?',
            [id]
        );

        if (!course) {
            return NextResponse.json(
                { error: '未找到指定课程' },
                { status: 404 }
            );
        }

        if (instructor_id && course.instructor_id !== instructor_id) {
            return NextResponse.json(
                { error: '只有课程的创建者才能修改课程' },
                { status: 403 }
            );
        }

        const result = await query(
            `UPDATE courses 
             SET title = ?, 
                 description = ?,
                 thumbnail = ?,
                 total_hours = ?,
                 instructor_id = ?,
                 price = ?,
                 status = ?,
                 author = ?
             WHERE id = ?`,
            [
                title,
                description,
                thumbnail,
                total_hours,
                instructor_id,
                price,
                status,
                instructor.name,  // 使用教师名称作为作者
                id
            ]
        );

        // 获取更新后的课程完整信息
        const [updatedCourse] = await query(`
            SELECT 
                c.*,
                u.name as instructor_name
            FROM courses c
            LEFT JOIN users u ON c.instructor_id = u.id
            WHERE c.id = ?
        `, [id]);

        return NextResponse.json(updatedCourse);

    } catch (error) {
        console.error('更新课程失败:', error);
        return NextResponse.json(
            { error: '更新课程失败' },
            { status: 500 }
        );
    }
}

// 删除课程
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: '课程ID不能为空' },
                { status: 400 }
            );
        }

        // 首先检查是否有学生已经注册该课程
        const [enrollmentCount] = await query(
            'SELECT COUNT(*) as count FROM enrollments WHERE course_id = ?',
            [id]
        );

        if (enrollmentCount.count > 0) {
            return NextResponse.json(
                { error: '该课程已有学生注册，无法删除' },
                { status: 400 }
            );
        }

        const result = await query(
            'DELETE FROM courses WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: '未找到指定课程' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: '课程删除成功'
        });

    } catch (error) {
        console.error('删除课程失败:', error);
        return NextResponse.json(
            { error: '删除课程失败' },
            { status: 500 }
        );
    }
} 