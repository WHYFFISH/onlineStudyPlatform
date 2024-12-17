import React from 'react';
import style from "../../teacher/PublishClass/PublishClass.module.css"; 
import ImageSorter from "./UploadPicDrag";
import Upload from "../../teacher/components/Upload";

const initialImages = [
    { id: 1, src: "../../assets/teacher/why.jpg", alt: "课程图片1" },
    { id: 2, src: "../../assets/teacher/test1.png", alt: "课程图片2" },
    { id: 3, src: "../../assets/teacher/test2.png", alt: "课程图片3" },
  ];
  const handleOrderChange = (newOrder) => {
    console.log("更新后的图片顺序:", newOrder);
  };
const FilesContent = () => {
  return (
    <div >
      <h1 className={style.centertitle}>相关文件上传</h1>
      <ImageSorter images={initialImages} onOrderChange={handleOrderChange} />
        <Upload/>
    </div>
    
  );
};

export default FilesContent;
