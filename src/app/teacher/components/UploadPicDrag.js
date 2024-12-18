"use client"
import React, { useState } from "react";
import { addCourseImages, getCourseImages } from "../utils/indexDB";

const UploadCourseImages = (Id) => {
  console.log(Id);
    const [courseId, setCourseId] = useState("");
    const [imageFiles, setImageFiles] = useState([]); // 上传的文件列表

    // 处理图片选择
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);
    };

    // 提交图片及顺序
    const handleSubmit = async () => {
        if (!courseId || imageFiles.length === 0) {
            alert("请输入课程 ID 并选择图片！");
            return;
        }

        // 转换文件路径（这里只模拟，实际项目中需要处理图片上传并保存路径）
        const imagePaths = imageFiles.map((file) => URL.createObjectURL(file));

        try {
            await addCourseImages(courseId, imagePaths);
            alert("图片上传成功！");
            console.log("已保存的图片路径：", imagePaths);

            // 可选：获取并展示课程图片
            const courseImages = await getCourseImages(courseId);
            console.log("获取到的课程图片数据:", courseImages);
        } catch (error) {
            console.error("图片保存失败", error);
        }
    };

    return (
        <div>
            <h2>上传课程图片</h2>
            <div>
                <label>课程 ID：</label>
                <input
                    type="text"
                    value={courseId}
                    onChange={(e) => setCourseId(Number(e.target.value))}
                    placeholder="输入课程 ID"
                />
            </div>

            <div>
                <label>选择图片：</label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </div>

            <button onClick={handleSubmit}>上传图片</button>
        </div>
    );
};

export default UploadCourseImages;
