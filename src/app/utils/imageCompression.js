import imageCompression from 'browser-image-compression';

export async function compress(file, options = {}) {
    try {
        // 默认压缩选项
        const defaultOptions = {
            maxSizeMB: 1,              // 最大文件大小
            maxWidthOrHeight: 1920,    // 最大宽度或高度
            useWebWorker: true,        // 使用 Web Worker
            fileType: 'image/jpeg',    // 输出文件类型
            initialQuality: 0.8,       // 初始压缩质量
        };

        // 合并选项
        const compressionOptions = {
            ...defaultOptions,
            ...options
        };

        // 压缩图片
        const compressedFile = await imageCompression(file, compressionOptions);

        return compressedFile;
    } catch (error) {
        console.error('图片压缩失败:', error);
        // 如果压缩失败，返回原文件
        return file;
    }
} 