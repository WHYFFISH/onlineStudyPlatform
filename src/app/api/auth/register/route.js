import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/app/utils/db';

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, name, password, email, phone, role } = body;

        // 1. 检查学号或邮箱或手机号是否已存在
        const existingUser = await query(
            'SELECT * FROM users WHERE id = ? OR email = ? OR phone = ?',
            [id, email, phone]
        );

        if (existingUser.length > 0) {
            const user = existingUser[0];

            // 如果用户已存在，根据提供的邮箱或手机号或学号来更新密码
            if (user.password) {
                // 如果已有密码，更新密码
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // 如果提供了新的手机号，检查该手机号是否已被其他用户使用
                if (phone && phone !== user.phone) {
                    const existingPhone = await query(
                        'SELECT * FROM users WHERE phone = ? AND id != ?',
                        [phone, user.id]
                    );

                    if (existingPhone.length > 0) {
                        return NextResponse.json(
                            { error: '手机号已被其他用户注册' },
                            { status: 400 }
                        );
                    }

                    // 更新密码和手机号
                    await query(
                        `UPDATE users 
                         SET password_hash = ?, 
                             phone = ?,
                             login_attempts = 0,
                             status = 'active'
                         WHERE id = ?`,
                        [hashedPassword, phone, user.id]
                    );
                } else {
                    // 更新密码
                    await query(
                        `UPDATE users 
                         SET password_hash = ?, 
                             login_attempts = 0,
                             status = 'active'
                         WHERE id = ?`,
                        [hashedPassword, user.id]
                    );
                }

                return NextResponse.json({ success: true, message: '密码更新成功' });
            } else {
                // 如果用户没有密码（说明是首次注册），则创建新密码
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // 更新用户信息
                await query(
                    `UPDATE users 
                     SET password_hash = ?, 
                         name = ?, 
                         role = ?
                     WHERE id = ?`,
                    [hashedPassword, name, role, user.id]
                );

                return NextResponse.json({ success: true, message: '注册成功，密码已创建' });
            }
        }

        // 2. 如果用户不存在，则创建新用户
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. 将新用户信息存入数据库
        await query(
            `INSERT INTO users (name, id, email, phone, password_hash, role)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [name, id, email, phone, hashedPassword, role]
        );

        return NextResponse.json({ success: true, message: '注册成功' });

    } catch (error) {
        console.error('注册失败:', error);
        return NextResponse.json(
            { error: '注册请求失败，请稍后再试' },
            { status: 500 }
        );
    }
}
