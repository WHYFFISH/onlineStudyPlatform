import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';
import { uploadFile } from '@/app/utils/oss';

export async function POST(request, { params }) {
    try {
        const id = params.id;
        const userId = '1'; // 临时硬编码用户ID

        const formData = await request.formData();
        const content = formData.get('content');
        const files = formData.getAll('files'); // 获取所有文件

        const uploadedFiles = [];

        // 处理文件上传
        for (const file of files) {
            try {
                const customDir = `assignments/${id}/submissions`;
                const uploadResult = await uploadFile(file, customDir);
                uploadedFiles.push(uploadResult);
            } catch (uploadError) {
                console.error('文件上传失败:', uploadError);
                throw new Error(`文件 ${file.name} 上传失败: ${uploadError.message}`);
            }
        }

        // 将文件信息转换为JSON字符串
        const fileUrlsJson = JSON.stringify(uploadedFiles.map(file => ({
            name: file.name,
            path: file.path,
            url: file.url,
            size: file.size,
            type: file.type
        })));

        // 创建提交记录，包含文件信息
        const result = await query(
            `INSERT INTO assignmentsubmissions 
             (assignment_id, user_id, content, file_url, status, submitted_at) 
             VALUES (?, ?, ?, ?, 'submitted', NOW())`,
            [id, userId, content, fileUrlsJson]
        );

        const submissionId = result.insertId;

        // 查询刚插入的提交记录
        const [submission] = await query(
            `SELECT * FROM assignmentsubmissions WHERE id = ?`,
            [submissionId]
        );

        // 解析文件信息用于返回
        submission.files = JSON.parse(submission.file_url || '[]');

        return NextResponse.json({
            success: true,
            message: '作业提交成功',
            data: {
                id: submission.id,
                status: submission.status,
                content: submission.content,
                files: submission.files,
                submitted_at: submission.submitted_at
            }
        });

    } catch (error) {
        console.error('提交作业失败:', error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || '提交作业失败',
                error: error.message
            },
            { status: 500 }
        );
    }
} 