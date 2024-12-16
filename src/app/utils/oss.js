import OSS from 'ali-oss';

let ossClient = null;

// 初始化OSS客户端
async function initOSSClient() {
    try {
        // 在服务器端使用完整URL
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const url = new URL('/api/oss/sts', baseUrl).toString();

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('获取STS Token失败');
        }

        const { data } = await response.json();

        // 刷新Token的函数
        const refreshToken = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('刷新Token失败');
                const { data } = await response.json();
                return {
                    accessKeyId: data.credentials.accessKeyId,
                    accessKeySecret: data.credentials.accessKeySecret,
                    stsToken: data.credentials.securityToken
                };
            } catch (error) {
                console.error('刷新Token失败:', error);
                throw error;
            }
        };

        // 使用STS Token创建OSS客户端
        ossClient = new OSS({
            region: data.region,
            bucket: data.bucket,
            accessKeyId: data.credentials.accessKeyId,
            accessKeySecret: data.credentials.accessKeySecret,
            stsToken: data.credentials.securityToken,
            refreshSTSToken: refreshToken,
            refreshSTSTokenInterval: 300000,
            secure: true
        });

        return ossClient;
    } catch (error) {
        console.error('初始化OSS客户端失败:', error);
        throw error;
    }
}

// 获取OSS客户端实例
async function getOSSClient() {
    if (!ossClient) {
        ossClient = await initOSSClient();
    }
    return ossClient;
}

// 上传文件
async function uploadFile(file, directory = '') {
    try {
        const client = await getOSSClient();

        // 生成文件路径
        const ext = file.name.split('.').pop();
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const path = directory ? `${directory}/${filename}` : filename;

        // 创建可读流
        const stream = file.stream();
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // 上传文件
        const result = await client.put(path, buffer, {
            mime: file.type,
            headers: {
                'Content-Type': file.type,
                'Content-Length': file.size.toString()
            }
        });

        // 生成签名URL，有效期1小时
        const signedUrl = await client.signatureUrl(path, {
            expires: 3600,
            method: 'GET'
        });

        return {
            name: file.name,
            path: result.name,
            url: signedUrl,
            size: file.size,
            type: file.type
        };
    } catch (error) {
        console.error('文件上传失败:', error);
        throw error;
    }
}

// 获取文件的Base64预览
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export {
    getOSSClient,
    uploadFile,
    getBase64
};