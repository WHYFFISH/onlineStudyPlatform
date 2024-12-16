import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function GET(request, { params }) {
    try {
        // 等待动态路由参数
        const id = await params.id;
        if (!id) {
            return NextResponse.json(
                { error: '课程ID是必需的' },
                { status: 400 }
            );
        }

        const courseId = parseInt(id);
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
            SELECT a.*, 
                   s.id as submission_id,
                   s.content as submission_content,
                   s.file_url as submission_file_url,
                   s.status as submission_status,
                   s.score as submission_score,
                   s.feedback as submission_feedback,
                   s.submitted_at as submission_date
            FROM assignments a
            LEFT JOIN assignmentsubmissions s ON a.id = s.assignment_id AND s.user_id = ?
            WHERE a.course_id = ?
            ORDER BY a.deadline ASC
        `, [userId, courseId]);

        // 处理作业数据
        const assignmentsWithSubmissions = assignments.map(assignment => ({
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            deadline: assignment.deadline,
            max_score: assignment.max_score,
            created_at: assignment.created_at,
            course_id: assignment.course_id,
            // 如果有提交记录，添加submission信息
            submission: assignment.submission_id ? {
                id: assignment.submission_id,
                content: assignment.submission_content,
                files: JSON.parse(assignment.submission_file_url || '[]'),
                status: assignment.submission_status,
                score: assignment.submission_score,
                feedback: assignment.submission_feedback,
                submitted_at: assignment.submission_date
            } : null
        }));

        // 获取课程视频
        const videos = await query(`
            SELECT *, CONCAT('video_', id, '_', created_at) as unique_key 
            FROM course_videos 
            WHERE course_id = ?
            ORDER BY created_at DESC
        `, [courseId]);

        // 获取课程文档
        const documents = await query(`
            SELECT *, CONCAT('doc_', id, '_', created_at) as unique_key 
            FROM course_documents 
            WHERE course_id = ?
            ORDER BY created_at DESC
        `, [courseId]);

        // 构建返回的课程数据
        const courseData = {
            ...course,
            schoolPanel: {
                name: '在线学习平台',
                imgUrl: '/school-logo.png'
            },
            teachers: course.instructor_name ? [{
                name: course.instructor_name,
                avatar: course.instructor_avatar
            }] : [],
            assignments: assignmentsWithSubmissions,
            videos: videos,      // 添加视频数据
            documents: documents, // 添加文档数据
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