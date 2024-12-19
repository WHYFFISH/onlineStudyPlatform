'use client';
import React, { useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, List, Button } from 'antd';
import styles from './uploadPage.module.css';
import Image from "next/image";
import NavigatorMenu from "../../components/navigatorMenu/page";
import Footer from "../../components/footer/page";
import logo from "../../../assets/homePage/logo.png"

const { Dragger } = Upload;

export default function CoursewareUpload() {
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
    <div>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image className={styles.logoIcon} src={logo} alt="Logo" priority />
          在线教育平台
        </div>
        {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{ width: '390px', fontSize: '16px' }} /> */}
        <NavigatorMenu initialCurrent={'personal'} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            onClick={() => {
              localStorage.clear();
              router.push('/');
            }}
            style={{ marginLeft: 60 }}
          >
            退出登录
          </Button>

        </div>
      </div>
      <div className={styles.uploadPage}style={{paddingBottom:80}}>

        <h1 className={styles.title}style={{paddingTop:64}}>课件上传页面</h1>
        <Dragger {...uploadProps} className={styles.dragger}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域进行上传</p>
          <p className="ant-upload-hint">支持单个或批量上传，支持所有文件类型</p>
        </Dragger>
        <h2 className={styles.listTitle}>已上传的课件</h2>
        <List
          bordered
          dataSource={fileList}
          renderItem={(item) => (
            <List.Item>
              <a href={item.data} target="_blank" rel="noopener noreferrer">
                {item.name}
              </a>
            </List.Item>
          )}
        />

      </div>
      <Footer />
    </div>

  );
}
