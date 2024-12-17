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
import style from "./PublishClass.module.css";
import UploadFileContent from "../../teacher/components/UploadFileContent";
import ClassInfoContent from "../../teacher/components/classInfoContent";
import NavigatorMenu from "../../components/navigatorMenu/page";
import Footer from "../../components/footer/page";
import logo from "../../../assets/homePage/logo.png"
import { SearchOutlined, PlayCircleOutlined, HeartOutlined } from '@ant-design/icons';
import { Margin } from "@mui/icons-material";
const { Header, Content, Sider } = Layout;
const initialImages = [
  { id: 1, src: "../../assets/teacher/why.jpg", alt: "课程图片1" },
  { id: 2, src: "../../assets/teacher/test1.png", alt: "课程图片2" },
  { id: 3, src: "../../assets/teacher/test2.png", alt: "课程图片3" },
];
const handleOrderChange = (newOrder) => {
  console.log("更新后的图片顺序:", newOrder);
};
// 定义每一栏对应的内容
const sections = {
  option1: <ClassInfoContent />,
  option2: <div>这是 Option 2 的界面内容。</div>,
  files: <UploadFileContent />,
};

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentSection, setCurrentSection] = useState("option1"); // 默认显示 Option 1

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Menu 点击事件处理
  const handleMenuClick = (e) => {
    setCurrentSection(e.key); // 根据点击的 key 切换内容
  };

  return (

    <Layout style={{ minHeight: "100vh" }}>

      <div className={style.header}>
        <div className={style.logo}>
          <Image className={style.logoIcon} src={logo} alt="Logo" />
          在线教育平台
        </div>
        {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{ width: '390px', fontSize: '16px' }} /> */}
        <NavigatorMenu initialCurrent={'course'} />
        <div style={{ display: 'flex', alignItems: 'center' }}>


        </div>
      </div>

      <div className={style.main}>
        <ClassInfoContent />
      </div>
      <Footer />

    </Layout>
  );
};

export default App;
