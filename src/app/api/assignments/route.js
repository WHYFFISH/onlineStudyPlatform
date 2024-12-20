import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function POST(request) {
    try {
        const body = await request.json();
        const { teacherId } = body;

        // 获取教师所教授课程的作业列表
        const assignments = await query(`
            SELECT 
                a.id,
                a.title,
                a.description,
                a.deadline,
                a.max_score,
                c.title as course_name,
                (SELECT COUNT(*) FROM AssignmentSubmissions 
                 WHERE assignment_id = a.id) as submission_count
            FROM Assignments a
            JOIN Courses c ON a.course_id = c.id
            WHERE c.instructor_id = ?
            ORDER BY a.deadline DESC
        `, [teacherId]);

        return NextResponse.json({
            assignments: assignments.map(assignment => ({
                ...assignment,
                deadline: new Date(assignment.deadline).toISOString(),
                status: getAssignmentStatus(assignment)
            }))
        });

    } catch (error) {
        console.error('获取作业列表失败:', error);
        return NextResponse.json(
            { error: '获取作业列表失败' },
            { status: 500 }
        );
    }
}

// 辅助函数：获取作业状态
function getAssignmentStatus(assignment) {
    const now = new Date();
    const deadline = new Date(assignment.deadline);

    if (now > deadline) {
        return '已截止';
    }
    if (assignment.submission_count > 0) {
        return `已提交 ${assignment.submission_count}`;
    }
    return '进行中';
}
