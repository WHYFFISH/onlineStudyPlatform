import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/app/utils/db';
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, password, email, phone, role } = body;
    // 基本验证
    if (!name || !password || !phone) {
      return NextResponse.json(
        { error: '用户名、密码和手机号是必填项' },
        { status: 400 }
      );
    }

    // 检查用户是否已存在
    const existingUser = await query(
      'SELECT * FROM users WHERE name = ? OR phone = ?',
      [name, phone]
    );

    if (existingUser.length > 0) {
      const user = existingUser[0];
      // 加密新密码
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 更新用户信息
      await query(
        `UPDATE users 
                 SET password_hash = ?, 
                     phone = ?,
                     login_attempts = 0,
                     status = 'active'
                 WHERE id = ?`,
        [hashedPassword, phone, user.id]
      );

      return NextResponse.json({
        message: '密码修改成功',
        userId: user.id
      });
    }

    // 2. 创建新用户
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
      [name, email || '', phone, hashedPassword, role]
    );

    return NextResponse.json({
      message: '注册成功',
      userId: result.insertId,
      role: role,
      name: name
    });

  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
} 