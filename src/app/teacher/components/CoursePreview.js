import React from "react";

export default function CoursePreview({ course }) {
  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      {course.images && (
        <div>
          {course.images.map((image, index) => (
            <img key={index} src={URL.createObjectURL(image)} alt={`轮播图-${index}`} />
          ))}
        </div>
      )}
      <p>评论区：{course.commentsEnabled ? "开启" : "关闭"}</p>
      <p>笔记区：{course.notesEnabled ? "开启" : "关闭"}</p>
    </div>
  );
}
