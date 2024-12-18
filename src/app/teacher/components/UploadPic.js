import React, { useState, useEffect } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const App = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );
    const [db, setDB] = useState(null); // IndexedDB实例
    const [fileList, setFileList] = useState([]); // 存储从IndexedDB加载的文件数据

    // 初始化IndexedDB
    useEffect(() => {
        const request = indexedDB.open('coursewareDB', 1);
        request.onsuccess = (event) => {
            setDB(event.target.result);
            loadFilesFromDB(event.target.result);
        };

        request.onerror = () => alert('IndexedDB初始化失败');

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('files')) {
                db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
            }
        };
    }, []);

    // 将文件存储到IndexedDB
    const saveFileToDB = (fileName, fileData) => {
        if (!db) return;
        const transaction = db.transaction(['files'], 'readwrite');
        const objectStore = transaction.objectStore('files');
        objectStore.add({ name: fileName, data: fileData });
        transaction.oncomplete = () => {
            message.success(`${fileName} 文件已成功保存到IndexedDB`);
            loadFilesFromDB(db);
        };
        transaction.onerror = () => message.error('文件保存失败');
    };

    // 从IndexedDB加载所有文件
    const loadFilesFromDB = (database) => {
        const transaction = database.transaction(['files'], 'readonly');
        const objectStore = transaction.objectStore('files');
        const request = objectStore.getAll();

        request.onsuccess = () => {
            setFileList(request.result);
        };
    };

    // 文件上传参数配置
    const uploadProps = {
        name: 'file',
        multiple: true,
        customRequest({ file, onSuccess }) {
            const reader = new FileReader();
            reader.onload = (e) => {
                saveFileToDB(file.name, e.target.result); // 存储文件数据
                onSuccess('ok'); // 通知上传完成
            };
            reader.readAsDataURL(file);
        },
        onChange(info) {
            const { status, name } = info.file || {};
            if (status === 'done') {
                alert(`${name} 上传成功`);
            } else if (status === 'error') {
                alert(`${name} 上传失败`);
            }
        },
    };

    return (
        <>
            <Upload {...uploadProps}
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-circle"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{
                        display: 'none',
                    }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                    priority
                />
            )}
        </>
    );
};
export default App;