import { NextResponse } from 'next/server';
import { query } from '@/app/utils/db';

export async function PUT(request) {
    try {
        const userId = request.headers.get('userId');
        const data = await request.json();
        const avatar = data?.avatar;

        // 参数验证
        if (!userId || !avatar) {
            console.log('Missing params:', { userId, avatar });
            return NextResponse.json(
                { error: '参数不完整' },
                { status: 400 }
            );
        }

        console.log('Updating avatar:', { userId, avatar }); // 调试日志

        // 更新数据库
        await query(
            'UPDATE users SET avatar = ? WHERE id = ?',
            [avatar, userId]
        );

        return NextResponse.json({
            success: true,
            message: '头像更新成功',
            avatar: avatar
        });

    } catch (error) {
        console.error('更新头像失败:', error);
        return NextResponse.json(
            { error: '更新头像失败', details: error.message },
            { status: 500 }
        );
    }
} 