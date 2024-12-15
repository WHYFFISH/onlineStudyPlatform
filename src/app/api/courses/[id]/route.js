import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function GET(request, { params }) {
    try {
        if (!params?.id) {
            return NextResponse.json(
                { error: '课程ID是必需的' },
                { status: 400 }
            );
        }

        const courseId = parseInt(params.id);
        const userId = 1; // TODO: 从session获取用户ID

        // 获取课程基本信息和教师信息
        const [course] = await query(`
            SELECT c.*, u.name as instructor_name, u.avatar as instructor_avatar
            FROM courses c
            LEFT JOIN users u ON c.instructor_id = u.id
            WHERE c.id = ?
        `, [courseId]);

        if (!course) {
            return NextResponse.json(
                { error: '未找到课程' },
                { status: 404 }
            );
        }

        // 获取课程作业信息
        const assignments = await query(`
            SELECT *
            FROM assignments
            WHERE course_id = ?
            ORDER BY deadline ASC
        `, [courseId]);

        // 为每个作业添加默认状态，并处理日期显示
        const assignmentsWithStatus = assignments.map(assignment => ({
            ...assignment,
            status: 'pending',  // 默认状态为待完成
            due_date: assignment.deadline  // 添加due_date字段以兼容前端显示
        }));

        // 构建返回的课程数据
        const courseData = {
            ...course,
            schoolPanel: {
                name: '在线学习平台',  // 默认学校名称
                imgUrl: '/school-logo.png'  // 默认学校logo
            },
            teachers: course.instructor_name ? [{
                name: course.instructor_name,
                avatar: course.instructor_avatar
            }] : [],
            assignments: assignmentsWithStatus,
            announcements: [
                {
                    title: '课程介绍',
                    content: course.description,
                    created_at: course.created_at
                }
            ]
        };

        return NextResponse.json(courseData);

    } catch (error) {
        console.error('获取课程详情失败:', error);
        return NextResponse.json(
            { error: '获取课程详情失败' },
            { status: 500 }
        );
    }
} 