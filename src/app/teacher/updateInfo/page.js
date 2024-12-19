"use client";

import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Input } from "antd";
import Image from "next/image";
import ImageSorter from "../components/UploadPicDrag";
import style from "../PublishClass/PublishClass.module.css";
import UploadFileContent from "../../teacher/components/UploadFileContent";
import ClassInfoContent from "./UpdateInfoContent";
import NavigatorMenu from "../../components/navigatorMenu/page";
import Footer from "../../components/footer/page";
import logo from "../../../assets/homePage/logo.png"
import { SearchOutlined, PlayCircleOutlined, HeartOutlined } from '@ant-design/icons';
import { Margin } from "@mui/icons-material";
import { useSearchParams  } from "next/navigation";
import { Upload, message, Button } from "antd";

const App = () => {
     
 
    const UpdateCourse = () => {
        const SearchParams = useSearchParams ();
         const id=SearchParams.get("courseId"); // 接收 URL 中的查询参数
        console.log("id:"+id);
        
    
        return id;
    };

    const id =UpdateCourse();
  
    return (
  
      <Layout style={{ minHeight: "100vh" }}>
  
        <div className={style.header}>
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
  
        <div className={style.main}>
        <ClassInfoContent courseId={id}/>
        </div>
        <Footer />
  
      </Layout>
    );
  };
  
  export default App;
  