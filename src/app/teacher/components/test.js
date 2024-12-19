import React, { useState, useEffect } from "react";
import { Input, message } from "antd";
import { Flex } from "antd";
import { addCourse, getAllCourses, updateCourse, getNextCourseId, openDatabase } from "../utils/indexDB";
import AddTeacherInfo from "../components/addTeacherInfo";
import style from "../../teacher/PublishClass/PublishClass.module.css";
import ImageSorter from "./UploadPicDrag";
import Upload from "../../teacher/components/Upload";
import UploadPic from "../../teacher/components/UploadPic";
import Idb from 'idb-js';
import db_teacher_config from "../utils/IDB_Config";

const { TextArea } = Input;

const FilesContent = () => {
    const [courseInfo, setCourseInfo] = useState({
        id: null,
        title: "",
        teacher: "",
        times: "",
        total_hours: "",
        price: "",
        status: "",

    });

    // 加载课程列表（IndexedDB 数据）
    const [courses, setCourses] = useState([]);

    // 模拟从 URL 获取课程 ID（根据实际需求替换）





    // 加载课程信息
    useEffect(() => {
        getAllCourses().then(setCourses);

        // 生成唯一课程 ID
        // const generateId = async () => {
        //     const nextId = await getNextCourseId();
        //     setCourseInfo((prev) => ({ ...prev, id: nextId }));
        // };
        // generateId();
    }, []);
    // 处理表单字段变化
    const handleChange = (field, value) => {
        setCourseInfo((prev) => ({ ...prev, [field]: value }));
    };

    const handleTeachersChange = (teachers) => {
        setCourseInfo((prev) => ({ ...prev, teachers }));
    };

    // 提交表单处理函数
    const handleSubmit = async () => {
        const generateId = async () => {
            const nextId = await getNextCourseId();
            setCourseInfo((prev) => ({ ...prev, id: nextId }));
        };
        generateId();
        if (!courseInfo.title || !courseInfo.description) {
            alert("请完整填写课程标题和描述！");
            return;
        }
        const courseToSave = { ...courseInfo };
        if (!courseInfo.id) {
            const nextId = await getNextCourseId();
            courseToSave.id = nextId;
        }

        try {
            // let courseToSave = { ...courseInfo };

            if (courseInfo.id) {
                await updateCourse(courseInfo); // 更新课程
                alert("课程更新成功！");
            } else {
                delete courseToSave.id;
                await addCourse(courseInfo); // 添加课程
                alert('课程发布成功，课程编号为: ');
            }

            const updatedCourses = await getAllCourses();
            setCourses(updatedCourses);

        } catch (error) {
            alert("操作失败，请稍后重试！");
            console.error(error);
        }
    };
    const initialImages = [
        { id: 1, src: "../../assets/teacher/why.jpg", alt: "课程图片1" },
        { id: 2, src: "../../assets/teacher/test1.png", alt: "课程图片2" },
        { id: 3, src: "../../assets/teacher/test2.png", alt: "课程图片3" },
    ];
    const handleOrderChange = (newOrder) => {
        console.log("更新后的图片顺序:", newOrder);
    };

    // const printAllData = async () => {
    //     const db = await openDatabase();
    //     const tx = db.transaction('courses', 'readonly');
    //     const store = tx.objectStore('courses');
    //     const images = await store.getAll();

    //     console.log('All courses:', courses);

    //     // 遍历并打印每个图片数据
    //     images.forEach((courses) => {
    //       console.log('courses:', courses);
    //     });
    //   };
    //   printAllData();

    return (
        <div className={style.centerContainer}>

            <h1 className={style.centertitle}>{courseInfo.id ? "修改课程详情" : "发布新课程"}</h1>

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
                    placeholder=""
                    value={courseInfo.teacher}
                    onChange={(e) => handleChange("teacher", e.target.value)}
                    style={{ width: "145px" }}
                />
                <label>课程时长：</label>
                <Input
                    placeholder=""
                    value={courseInfo.total_hours}
                    onChange={(e) => handleChange("total_hours", e.target.value)}
                    style={{ width: "145px" }}
                />
            </div>

            <div className={style.labelInputContainer}>
                <label style={{ marginRight: 10 }}>价格：</label>
                <Input
                    placeholder=""
                    value={courseInfo.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    style={{ width: "150px", marginRight: 15 }}
                />
                <label style={{ marginRight: 10 }}>状态：</label>
                <Input
                    placeholder=""
                    value={courseInfo.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    style={{ width: "150px" }}
                />
            </div>


            <div className={style.InfoInputContainer}>
                <label>课程简介：</label>
                <Flex vertical gap={32}>
                    <TextArea
                        showCount
                        maxLength={2000}
                        placeholder="课程简介"
                        value={courseInfo.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        style={{
                            height: 240,
                            resize: "none",
                            width: "485px",
                        }}
                    />
                </Flex>
            </div>

            <div className={style.sectionBox}>

                <ImageSorter courseId={courseInfo.id} />
                <Upload />
            </div>

            <button className={style.actionButton} onClick={handleSubmit}>
                {courseInfo.id ? "更新" : "发布"}
            </button>
        </div>
    );
};

export default FilesContent;
