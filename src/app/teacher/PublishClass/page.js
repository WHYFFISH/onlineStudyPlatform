"use client";
import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import Image from "next/image";
import ImageSorter from "../../teacher/components/drag";
import style from "./PublishClass.module.css"; 
import UploadFileContent from "../../teacher/components/UploadFileContent";
import ClassInfoContent from "../../teacher/components/classInfoContent";
import NavigatorMenu from "../../components/navigatorMenu/page";
import Footer from "../../components/footer/page";
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
  option1: <ClassInfoContent/>,
  option2: <div>这是 Option 2 的界面内容。</div>,
  files: <UploadFileContent/>,
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
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <NavigatorMenu/>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["option1"]}
          mode="inline"
          onClick={handleMenuClick} // 绑定点击事件
          items={[
            { key: "option1", icon: <PieChartOutlined />, label: "课程信息" },
            { key: "option2", icon: <DesktopOutlined />, label: "Option 2" },
            { key: "files", icon: <FileOutlined />, label: "文件上传" },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content
          style={{
            margin: "0 16px",
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {sections[currentSection]} {/* 根据当前选择显示内容 */}
        </Content>
        <Footer/>
      </Layout>
    </Layout>
  );
};

export default App;
