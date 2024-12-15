"use client";

import React, { useState } from "react";
import CourseList from "./components/CourseList";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import whyAvatar from "../../assets/teacher/why.jpg"
import Image from "next/image";
import Link from 'next/link';

export default function TeacherDetailsPage() {
  const router = useRouter();

  // 示例教师信息
  const teacherInfo = {
    avatar: "C:\Users\MI\onlineStudyPlatform\src\assets", // 头像路径
    name: "王晗瑜老师",
    bio: "多年教学经验，擅长多媒体技术与课程设计。",
    courses: [
      { id: 1, title: "Web开发基础", description: "学习HTML、CSS、JavaScript的基础知识。" },
      { id: 2, title: "React进阶", description: "掌握React Hooks、状态管理与性能优化。" },
    ],
  };

  const goToCoursewareUpload = (courseId) => {
    router.push(`/teacher/upload`);
  };

  const goToHomeworkPublish = (courseId) => {
    router.push(`/teacher/homework?courseId=${courseId}`);
  };

  const redirectToCoursePage=()=>{
    router.push(`/teacher/PublishClass`);
  }

  return (
    <div className={styles.teacherDetails}>
      <div className={styles.profile}>
        <Image
          src={whyAvatar}
          alt="教师头像" git
          className={styles.avatar}
        />
        <div className={styles.info}>
          <h1>{teacherInfo.name}</h1>
          <p>{teacherInfo.bio}</p>
        </div>
        <Link href="teacher/PublishClass">
        <button className="publish-btn">发布课程</button>
      </Link>

      </div>

      

      <div className={styles.courses}>
        <h2>我的课程</h2>
        <CourseList
          courses={teacherInfo.courses}
          onUploadClick={goToCoursewareUpload}
          onHomeworkClick={goToHomeworkPublish}
        />
      </div>
    </div>
  );
}
