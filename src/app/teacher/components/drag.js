"use client";

import React, { useState } from "react";
import styles from "./ImageSorter.module.css"; // 引入样式

export default function ImageSorter({ images, onOrderChange }) {
  const [imageOrder, setImageOrder] = useState(images); // 初始图片列表

  // 更新顺序显示
  const updateOrder = (newOrder) => {
    setImageOrder(newOrder);
    if (onOrderChange) {
      onOrderChange(newOrder); // 通知父组件更新
    }
  };

  // 重置图片顺序
  const resetOrder = () => {
    updateOrder(images); // 重置为初始顺序
  };

  // 绑定拖拽事件
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
      updateOrder(updatedOrder);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // 允许放置
  };

  return (
    <div className={styles.container}>
      <h2>课程图片排序</h2>
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
            <img src={image.src} alt={image.alt} className={styles.image} />
          </li>
        ))}
      </ul>
      <button className={styles.resetButton} onClick={resetOrder}>
        重置图片顺序
      </button>
    </div>
  );
}
