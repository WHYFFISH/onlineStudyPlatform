"use client";
import React from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import styles from "./ImageCarousel.module.css";

export default function ImageCarousel({ images, setImages }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedImages = Array.from(images);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);
    setImages(reorderedImages);
  };

  function bindDragEvents() {
    const items = Array.from(list.children); // 重新获取所有项
    let draggedItem = null;

    items.forEach(item => {
      // 拖拽开始
      item.addEventListener('dragstart', (e) => {
        draggedItem = e.target; // 存储正在拖动的项
        e.target.classList.add('dragging');
      });

      // 拖拽结束
      item.addEventListener('dragend', () => {
        document.querySelectorAll('.hover').forEach(el => el.classList.remove('hover'));
        draggedItem.classList.remove('dragging');
        draggedItem = null; // 清除拖动项
      });

      // 拖拽经过目标位置
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!item.classList.contains('dragging')) {
          item.classList.add('hover');
        }
      });

      // 放置操作
      item.addEventListener('drop', (e) => {
        e.preventDefault();

        if (draggedItem !== item) {
          const draggedValue = draggedItem.dataset.value;
          const targetValue = item.dataset.value;

          // 更新列表
          let draggedIndex = Array.from(list.children).indexOf(draggedItem);
          let targetIndex = Array.from(list.children).indexOf(item);

          if (draggedIndex < targetIndex) {
            list.insertBefore(draggedItem, item.nextSibling);
          } else {
            list.insertBefore(draggedItem, item);
          }

          updateOrderDisplay();
        }
        item.classList.remove('hover');
      });
    });
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="images">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className={styles.carousel}>
            {images.map((image, index) => (
              <Draggable key={index} draggableId={index.toString()} index={index}>
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className={styles.imageItem}
                  >
                    <img src={URL.createObjectURL(image)} alt={`轮播图-${index}`} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
