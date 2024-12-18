"use client";

import React, { useState, useEffect } from "react";
import { Upload, message, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "../components/ImageSorter.module.css"; // 引入样式
import { openDB } from "idb";
import NavigatorMenu from "../../components/navigatorMenu/page";
import style from "../PublishClass/PublishClass.module.css";
import logo from "../../../assets/homePage/logo.png"
import Image from "next/image";
import Footer from "../../components/footer/page";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function ImageUploadSorter(courseId) {
  const [imageOrder, setImageOrder] = useState([]); // 图片列表

  const openDatabase = async () => {
    const db = await openDB("CourseDatabase", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("images")) {
          db.createObjectStore("images", { keyPath: "id", autoIncrement: true });

          store.createIndex("id", "id", { unique: false });
          store.createIndex("course", "course", { unique: false });
          store.createIndex("order", "order", { unique: false });
        }
      },
    });
    return db;
  };
  const loadImagesFromDB = async () => {
    const db = await openDatabase();
    const tx = db.transaction("images", "readonly");
    const store = tx.objectStore("images");
    const allImages = await store.getAll();

    // 筛选出当前课程的图片并按 order 排序
    const courseImages = allImages
      .filter((img) => img.course === courseId)
      .sort((a, b) => a.order - b.order);

    setImageOrder(courseImages);
  };

  const saveImagesToDB = async (images) => {
    const db = await openDatabase();
    const tx = db.transaction("images", "readwrite");
    const store = tx.objectStore("images");

    const existingImages = await store.getAll();
    existingImages
      .filter((img) => img.course === courseId)
      .forEach((img) => store.delete(img.id));

    // 存储新数据
    images.forEach((image, index) => {
      store.put({ ...image, order: index }); // 更新 order
    });

    await tx.done;
  };

  // 上传文件处理逻辑
  const handleUpload = async ({ file, onSuccess }) => {
    const base64 = await getBase64(file);
    const newImage = {
      id: file.uid, // 唯一标识符
      src: base64, // 图片数据
      name: file.name,
      course: courseId,
      order: imageOrder.length,
    };

    setImageOrder((prev) => {
      const updatedOrder = [...prev, newImage];
      saveImagesToDB(updatedOrder); // 保存顺序到 DB
      return updatedOrder;
    });
    onSuccess("ok");
    alert(`${file.name} 上传成功`);
  };

  // 拖拽相关逻辑
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
      setImageOrder(updatedOrder); // 更新状态
      saveImagesToDB(updatedOrder);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // 允许拖拽放置
  };

  // 重置图片顺序
  const resetOrder = () => setImageOrder([]);

  // 上传组件配置
  const uploadProps = {
    customRequest: handleUpload, // 自定义上传
    showUploadList: false, // 隐藏默认上传列表
  };

  const handleDelete = (id) => {
    setImageOrder((prev) => {
      const updatedOrder = prev.filter((image) => image.id !== id);
      saveImagesToDB(updatedOrder); // 删除后更新 DB
      return updatedOrder;
    });
    alert.success("图片已删除");
  };
  const handleChange = (field, value) => {
    setCourseInfo((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    loadImagesFromDB();
  }, [courseId]);


  // const printAllCourses = async () => {
  //   const db = await openDatabase();
  //   const tx = db.transaction("images", "readonly");
  //     const store = tx.objectStore("images");
  //   const images = await store.getAll('images');
  //   console.log(images);
  // };

  //  printAllCourses();


  return (
    <div>
      <div className={style.header} style={{marginBottom:64}}>
        <div className={style.logo}>
          <Image className={style.logoIcon} src={logo} alt="Logo" />
          在线教育平台
        </div>
        {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{ width: '390px', fontSize: '16px' }} /> */}
        <NavigatorMenu initialCurrent={'personal'} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            onClick={() => {
              localStorage.clear();
              router.push('/');
            }}
            style={{ marginLeft: 60 }}
          >
            退出登录
          </Button>
        </div>

      </div>

      <div className={styles.container}>

        <h2 >上传首页轮播图</h2>


        {/* 拖拽排序区域 */}
        {imageOrder.length > 0 && (
          <ul className={styles.imageList} >
            {imageOrder.map((image, index) => (
              <li
                key={image.id}
                className={styles.imageItem}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}

              >
                <img src={image.src} alt={image.name} className={styles.image} />
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "red",
                    color: "#fff",

                  }}
                  onClick={() => handleDelete(image.id)}
                />
              </li>

            ))}
          </ul>
        )

        }

        <Upload {...uploadProps}>
          <Button icon={<PlusOutlined />} style={{ marginTop: 10 }}>上传图片</Button>
        </Upload>

      </div>
      <div style={{marginTop:30}}> 
         <Footer />
      </div>
     
    </div>


  );
}
