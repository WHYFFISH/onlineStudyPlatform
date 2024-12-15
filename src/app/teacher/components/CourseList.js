'use client';
import React from "react";
import styles from "./CourseList.module.css";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

export default function CourseList({ courses, onUploadClick, onHomeworkClick }) {
    return (
        <div className={styles.courseList}>
            {courses.map((course) => (
                <div key={course.id} className={styles.courseCard}>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className={styles.actions}>
                        <button className={styles.actionButton}>
                            课程主页
                        </button>
                        <button className={styles.actionButton} onClick={() => onUploadClick(course.id)}>
                            课件上传
                        </button>
                        <button className={styles.actionButton} onClick={() => onHomeworkClick(course.id)}>
                            布置作业
                        </button>

                    </div>
                </div>
            ))}
        </div>
    );
}



