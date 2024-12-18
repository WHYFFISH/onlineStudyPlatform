import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 5;
        const offset = (page - 1) * limit;
        const userId = request.headers.get('userId');

        // 获取已报名课程的作业
        const assignments = await query(`
            SELECT 
                'assignment' as type,
                a.id,
                a.title,
                c.title as courseName,
                a.deadline,
                s.submitted_at as submittedAt,
                s.score,
                CASE WHEN s.id IS NOT NULL THEN TRUE ELSE FALSE END as completed
            FROM assignments a
            JOIN courses c ON a.course_id = c.id
            JOIN enrollments e ON c.id = e.course_id
            LEFT JOIN assignmentsubmissions s ON a.id = s.assignment_id AND s.user_id = ?
            WHERE e.user_id = ?
            AND (
                (s.id IS NULL AND a.deadline > NOW())
                OR s.id IS NOT NULL
            )
            ORDER BY 
                CASE WHEN s.id IS NULL THEN 0 ELSE 1 END,
                a.deadline ASC
        `, [userId, userId]);

        // 获取已报名课程的未完成学习资源
        const resources = await query(`
            SELECT 
                r.type,
                r.id,
                r.title,
                c.title as courseName,
                DATE_ADD(NOW(), INTERVAL 7 DAY) as deadline,
                'pending' as status
            FROM resources r
            JOIN chapters ch ON r.chapter_id = ch.id
            JOIN courses c ON ch.course_id = c.id
            JOIN enrollments e ON c.id = e.course_id
            LEFT JOIN learningprogress lp ON r.id = lp.resource_id AND lp.user_id = ?
            WHERE e.user_id = ?
            AND (lp.completed IS NULL OR lp.completed = FALSE)
        `, [userId, userId]);

        // 获取已报名课程的未完成练习
        const exercises = await query(`
            SELECT 
                'exercise' as type,
                ex.id,
                ex.question as title,
                c.title as courseName,
                DATE_ADD(NOW(), INTERVAL 7 DAY) as deadline,
                'pending' as status
            FROM exercises ex
            JOIN chapters ch ON ex.chapter_id = ch.id
            JOIN courses c ON ch.course_id = c.id
            JOIN enrollments e ON c.id = e.course_id
            LEFT JOIN exerciseattempts ea ON ex.id = ea.exercise_id AND ea.user_id = ?
            WHERE e.user_id = ?
            AND ea.id IS NULL
        `, [userId, userId]);

        // 合并所有任务并按截止日期排序
        const allTasks = [...assignments, ...resources, ...exercises]
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        // 应用分页
        const paginatedTasks = allTasks.slice(offset, offset + limit);

        return NextResponse.json({
            tasks: allTasks,
            total: allTasks.length,
            page: page,
            totalPages: Math.ceil(allTasks.length / limit)
        });

    } catch (error) {
        console.error('获取待完成任务失败:', error);
        return NextResponse.json(
            { error: '获取待完成任务失败' },
            { status: 500 }
        );
    }
} 