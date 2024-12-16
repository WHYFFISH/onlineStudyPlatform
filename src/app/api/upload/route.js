import { NextResponse } from 'next/server';
import OSS from 'ali-oss';
import { STS } from 'ali-oss';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const directory = formData.get('directory');

        if (!file) {
            return NextResponse.json(
                { error: '没有文件被上传' },
                { status: 400 }
            );
        }

        // 获取STS Token
        const sts = new STS({
            accessKeyId: process.env.OSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET
        });

        const result = await sts.assumeRole(
            process.env.OSS_RAM_ROLE_ARN,
            null,
            15 * 60,
            'session-name'
        );

        // 使用STS Token创建OSS客户端
        const client = new OSS({
            region: process.env.NEXT_PUBLIC_OSS_REGION,
            accessKeyId: result.credentials.AccessKeyId,
            accessKeySecret: result.credentials.AccessKeySecret,
            stsToken: result.credentials.SecurityToken,
            bucket: process.env.NEXT_PUBLIC_OSS_BUCKET,
            secure: true
        });

        // 生成文件路径
        const ext = file.name.split('.').pop();
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const path = directory ? `${directory}/${filename}` : filename;

        // 将文件转换为 buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // 上传文件
        const uploadResult = await client.put(path, buffer, {
            mime: file.type,
            headers: {
                'Content-Type': file.type,
                'Content-Length': file.size.toString()
            }
        });

        // 生成签名URL
        const url = await client.signatureUrl(path, {
            expires: 3600,
            method: 'GET'
        });

        return NextResponse.json({
            name: file.name,
            path: uploadResult.name,
            url: url,
            size: file.size,
            type: file.type
        });
    } catch (error) {
        console.error('文件上传失败:', error);
        return NextResponse.json(
            { error: '文件上传失败', message: error.message },
            { status: 500 }
        );
    }
}