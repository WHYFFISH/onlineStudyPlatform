import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function GET(request, { params }) {
    try {
        const userId = request.headers.get('userId');
        const { id } = await params;

        const assignments = await query(
            `SELECT a.*, 
                    c.title as course_name,
                    s.id as submission_id,
                    s.content as submission_content,
                    s.file_url as submission_file_url,
                    s.status as submission_status,
                    s.score as submission_score,
                    s.feedback as submission_feedback,
                    s.submitted_at as submission_date
             FROM assignments a
             LEFT JOIN courses c ON a.course_id = c.id
             LEFT JOIN assignmentsubmissions s ON a.id = s.assignment_id AND s.user_id = ?
             WHERE a.id = ?`,
            [userId, id]
        );

        if (!assignments || assignments.length === 0) {
            return NextResponse.json(
                { message: '作业不存在' },
                { status: 404 }
            );
        }

        const assignment = assignments[0];

        // 处理提交记录
        const submission = assignment.submission_id ? {
            id: assignment.submission_id,
            content: assignment.submission_content,
            files: JSON.parse(assignment.submission_file_url || '[]'),
            status: assignment.submission_status,
            score: assignment.submission_score,
            feedback: assignment.submission_feedback,
            submitted_at: assignment.submission_date
        } : null;

        // 构建返回数据
        const response = {
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            course_id: assignment.course_id,
            course_name: assignment.course_name,
            deadline: assignment.deadline,
            max_score: assignment.max_score,
            created_at: assignment.created_at,
            submission: submission
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('获取作业详情失败:', error);
        return NextResponse.json(
            { message: '获取作业详情失败', error: error.message },
            { status: 500 }
        );
    }
} 