"use client";
import React, { useState, useEffect } from "react";
import { Input, message } from "antd";
import { getCourseById, updateCourse } from "../utils/indexDB";
import style from "../../teacher/PublishClass/PublishClass.module.css";

const { TextArea } = Input;

const UpdateCourse = ({ courseId }) => {
    courseId=Number(courseId);
    console.log(courseId)
    const [courseInfo, setCourseInfo] = useState({
        id: null,
        title: "",
        teacher: "",
        times: "",
        total_hours: "",
        price: "",
        status: "",
        description: "",
    });

    // 页面加载时根据 courseId 初始化数据
    useEffect(() => {
        const fetchCourse = async () => {
            if (courseId) {
                console.log("Fetching course with ID:", courseId); // 调试信息
                const course = await getCourseById(courseId); // 获取课程信息
                if (course) {
                    console.log("Course found:", course); // 确认已找到课程
                    setCourseInfo(course); // 设置课程信息到 state
                } else {
                    alert(`未找到课程 ID 为 ${courseId} 的课程！`);
                }
            } else {
                alert("未提供课程 ID，无法更新！");
            }
        };
    
        fetchCourse();
    }, [courseId]); // 监听 courseId 的变化

    // 处理表单字段变化
    const handleChange = (field, value) => {
        setCourseInfo((prev) => ({ ...prev, [field]: value }));
    };

    // 提交更新处理函数
    const handleUpdate = async () => {
        if (!courseInfo.title || !courseInfo.description) {
            alert("请完整填写课程标题和描述！");
            return;
        }
        

        try {
            courseInfo.id=courseId;
            
            if (courseInfo.id) {
                // 确保是更新已有课程
                await updateCourse(courseInfo); // 调用更新方法
                alert("课程更新成功！");
            } else {
                alert("无法更新课程：缺少课程 ID！");
            }
        } catch (error) {
            alert("更新失败，请稍后重试！");
            console.error(error);
        }
    };

    return (
        <div className={style.centerContainer}>
            <h1 className={style.centertitle}>修改课程详情</h1>

            <div className={style.labelInputContainer}>
                <label>课程名：</label>
                <Input
                    placeholder="请输入课程名"
                    value={courseInfo.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    style={{ width: "400px" }}
                />
            </div>

            <div className={style.labelInputContainer}>
                <label>老师ID：</label>
                <Input
                    placeholder="请输入老师ID"
                    value={courseInfo.teacher}
                    onChange={(e) => handleChange("teacher", e.target.value)}
                    style={{ width: "145px" }}
                />
                <label>课程时长：</label>
                <Input
                    placeholder="请输入课程时长"
                    value={courseInfo.total_hours}
                    onChange={(e) => handleChange("total_hours", e.target.value)}
                    style={{ width: "145px" }}
                />
            </div>

            <div className={style.labelInputContainer}>
                <label style={{ marginRight: 10 }}>价格：</label>
                <Input
                    placeholder="请输入课程价格"
                    value={courseInfo.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    style={{ width: "150px", marginRight: 15 }}
                />
                <label style={{ marginRight: 10 }}>状态：</label>
                <Input
                    placeholder="请输入课程状态"
                    value={courseInfo.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    style={{ width: "150px" }}
                />
            </div>

            <div className={style.InfoInputContainer}>
                <label>课程简介：</label>
                <TextArea
                    showCount
                    maxLength={2000}
                    placeholder="请输入课程简介"
                    value={courseInfo.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    style={{
                        height: 240,
                        resize: "none",
                        width: "485px",
                    }}
                />
            </div>

            <button className={style.actionButton} onClick={handleUpdate}>
                更新课程
            </button>
        </div>
    );
};

export default UpdateCourse;
