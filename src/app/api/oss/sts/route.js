import { NextResponse } from 'next/server';
import OSS from 'ali-oss';
import { STS } from 'ali-oss';

export async function GET() {
    try {
        // 创建STS客户端
        const sts = new STS({
            accessKeyId: process.env.OSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET
        });

        // 生成临时访问凭证
        const policy = {
            Statement: [
                {
                    Action: [
                        'oss:PutObject',
                        'oss:GetObject'
                    ],
                    Effect: 'Allow',
                    Resource: [
                        `acs:oss:*:*:${process.env.NEXT_PUBLIC_OSS_BUCKET}/*`
                    ]
                }
            ],
            Version: '1'
        };

        // 调用assumeRole获取临时凭证
        const result = await sts.assumeRole(
            process.env.OSS_RAM_ROLE_ARN,     // RAM角色ARN
            null,                             // policy参数设为null
            15 * 60,                          // 过期时间
            'session-name'                    // 会话名称
        );

        return NextResponse.json({
            success: true,
            data: {
                region: process.env.NEXT_PUBLIC_OSS_REGION,
                bucket: process.env.NEXT_PUBLIC_OSS_BUCKET,
                credentials: {
                    accessKeyId: result.credentials.AccessKeyId,
                    accessKeySecret: result.credentials.AccessKeySecret,
                    securityToken: result.credentials.SecurityToken,
                    expiration: result.credentials.Expiration
                }
            }
        });
    } catch (error) {
        console.error('获取STS Token失败:', error);
        return NextResponse.json(
            {
                success: false,
                message: '获取上传凭证失败',
                error: error.message
            },
            { status: 500 }
        );
    }
}