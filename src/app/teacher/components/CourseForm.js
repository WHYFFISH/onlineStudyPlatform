"use client";
import React, { useState } from "react";
// import styles from "./CourseForm.module.css";

export default function CourseForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [notesEnabled, setNotesEnabled] = useState(true);

  // 上传图片事件
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  // 表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    const courseData = { title, description, images, commentsEnabled, notesEnabled };
    onSubmit(courseData);
  };

//   return (
    // <form onSubmit={handleSubmit} className={styles.courseForm}>
//       <h2>编辑课程详情</h2>
//       <label>
//         课程标题：
//         <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
//       </label>
//       <label>
//         课程简介：
//         <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
//       </label>
//       <label>
//         上传轮播图片：
//         <input type="file" multiple onChange={handleImageUpload} />
//       </label>
//       <label>
//         评论区：
//         <input type="checkbox" checked={commentsEnabled} onChange={() => setCommentsEnabled(!commentsEnabled)} />
//       </label>
//       <label>
//         笔记区：
//         <input type="checkbox" checked={notesEnabled} onChange={() => setNotesEnabled(!notesEnabled)} />
//       </label>
//       <button type="submit">预览课程</button>
//     </form>
//   );
}
