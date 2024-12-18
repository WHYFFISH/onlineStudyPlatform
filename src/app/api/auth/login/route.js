import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/app/utils/db';

const MAX_LOGIN_ATTEMPTS = 3; // 最大尝试次数

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password, role } = body;

        // 1. 查询用户（支持用户名或手机号登录）
        const users = await query(
            `SELECT * FROM users 
             WHERE (name = ? OR phone = ?) 
             AND role = ?`,
            [username, username, role]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { error: '用户名不存在或角色不匹配' },
                { status: 401 }
            );
        }

        const user = users[0];

        // 2. 检查用户名状态
        if (user.status === 'suspended') {
            return NextResponse.json(
                { error: '用户名已被冻结，请联系管理员' },
                { status: 401 }
            );
        }

        if (user.status === 'inactive') {
            return NextResponse.json(
                { error: '用户名未激活，请先激活用户名' },
                { status: 401 }
            );
        }

        // 3. 检查登录尝试次数
        if (user.login_attempts >= MAX_LOGIN_ATTEMPTS) {
            // 更新状态为已冻结
            await query(
                'UPDATE users SET status = ? WHERE id = ?',
                ['suspended', user.id]
            );

            return NextResponse.json(
                { error: '登录尝试次数过多，用户名已被冻结，请联系管理员' },
                { status: 401 }
            );
        }

        // 4. 验证密码
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            // 更新登录尝试次数
            const newAttempts = user.login_attempts + 1;
            await query(
                'UPDATE users SET login_attempts = ? WHERE id = ?',
                [newAttempts, user.id]
            );

            const remainingAttempts = MAX_LOGIN_ATTEMPTS - newAttempts;
            return NextResponse.json(
                {
                    error: `密码错误，还剩${remainingAttempts}次尝试机会`,
                    remainingAttempts
                },
                { status: 401 }
            );
        }

        // 5. 登录成功，重置尝试次数
        await query(
            'UPDATE users SET login_attempts = 0 WHERE id = ?',
            [user.id]
        );

        // 6. 返回用户信息（不包含密码）
        const { password_hash, ...userWithoutPassword } = user;

        return NextResponse.json({
            message: '登录成功',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('登录错误:', error);
        return NextResponse.json(
            { error: '登录失败，请稍后重试' },
            { status: 500 }
        );
    }
} 