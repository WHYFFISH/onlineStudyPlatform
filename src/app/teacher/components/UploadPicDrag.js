"use client";

import React, { useState } from "react";
import { Upload, message, Button } from "antd";
import { PlusOutlined ,DeleteOutlined} from "@ant-design/icons";
import styles from "./ImageSorter.module.css"; // 引入样式

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function ImageUploadSorter() {
  const [imageOrder, setImageOrder] = useState([]); // 图片列表

  // 上传文件处理逻辑
  const handleUpload = async ({ file, onSuccess }) => {
    const base64 = await getBase64(file);
    const newImage = {
      id: file.uid, // 唯一标识符
      src: base64, // 图片数据
      name: file.name,
    };

    setImageOrder((prev) => [...prev, newImage]); // 添加图片到列表
    onSuccess("ok");
    message.success(`${file.name} 上传成功`);
  };

  // 拖拽相关逻辑
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("dragIndex", index);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("dragIndex"), 10);

    if (dragIndex !== targetIndex) {
      const updatedOrder = [...imageOrder];
      const [draggedItem] = updatedOrder.splice(dragIndex, 1); // 移除拖拽项
      updatedOrder.splice(targetIndex, 0, draggedItem); // 插入到目标位置
      setImageOrder(updatedOrder); // 更新状态
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // 允许拖拽放置
  };

  // 重置图片顺序
  const resetOrder = () => setImageOrder([]);

  // 上传组件配置
  const uploadProps = {
    customRequest: handleUpload, // 自定义上传
    showUploadList: false, // 隐藏默认上传列表
  };

  const handleDelete = (id) => {
    setImageOrder((prev) => prev.filter((image) => image.id !== id));
    message.success("图片已删除");
  };


  return (
    <div className={styles.container}>
      <h2>上传首页轮播图</h2>

      {/* 上传组件 */}
      

      {/* 拖拽排序区域 */}
      {imageOrder.length > 0 && (
        <ul className={styles.imageList}>
          {imageOrder.map((image, index) => (
            <li
              key={image.id}
              className={styles.imageItem}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
            >
              <img src={image.src} alt={image.name} className={styles.image} />
              <Button
                icon={<DeleteOutlined />}
                size="small"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "red",
                  color: "#fff",
                }}
                onClick={() => handleDelete(image.id)}
              />
            </li>
            
          ))}
        </ul>
      )
      
      }
      
      <Upload {...uploadProps}>
        <Button icon={<PlusOutlined />}  style={{marginTop:10}}>上传图片</Button>
      </Upload>

    </div>
  );
}
