import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/app/utils/db';

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password, email, phone, role } = body;

        // 1. 检查用户名、邮箱或手机号是否已存在
        const existingUser = await query(
            'SELECT * FROM users WHERE name = ? OR email = ? OR phone = ?',
            [username, email, phone]
        );

        // 如果用户存在，则进行密码修改操作
        if (existingUser.length > 0) {
            const user = existingUser[0];

            // 加密新密码
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 更新密码和手机号（如果提供了新的手机号）
            if (phone) {
                // 检查新手机号是否被其他用户使用
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
                // 仅更新密码
                await query(
                    `UPDATE users 
                     SET password_hash = ?,
                         login_attempts = 0,
                         status = 'active'
                     WHERE id = ?`,
                    [hashedPassword, user.id]
                );
            }

            return NextResponse.json({
                message: '密码修改成功',
                userId: user.id
            });
        }

        // 2. 如果用户不存在，则进行新用户注册
        // 加密密码
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 插入新用户
        const result = await query(
            `INSERT INTO users (
                name, 
                email, 
                phone,
                password_hash, 
                role, 
                status, 
                created_at,
                login_attempts
            ) VALUES (?, ?, ?, ?, ?, 'active', NOW(), 0)`,
            [username, email, phone, hashedPassword, role]
        );

        return NextResponse.json({
            message: '注册成功',
            userId: result.insertId,
            role: role,
            name: username
        });

    } catch (error) {
        console.error('操作错误:', error);
        return NextResponse.json(
            { error: '操作失败，请稍后重试' },
            { status: 500 }
        );
    }
} 