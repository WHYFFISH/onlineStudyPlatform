"use client"
import { Spin, Typography, Tag, Select, Carousel, Menu, Card, Row, Col, Button, Input, Badge, notification, List, Divider } from 'antd';
const { Title, Paragraph } = Typography;
import { CheckCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from 'react';
import { SearchOutlined, PlayCircleOutlined, HeartOutlined } from '@ant-design/icons';
import Link from 'next/link';
import styles from "./page.module.css";
import logo from "../../assets/homePage/logo.png"
import carousel1 from "../../assets/homePage/carousel1.png"
import carousel2 from "../../assets/homePage/carousel2.png"
import carousel3 from "../../assets/homePage/carousel3.png"
import course1 from "../../assets/homePage/course1.png"
import course2 from "../../assets/homePage/course2.png"
import course3 from "../../assets/homePage/course3.png"
import course4 from "../../assets/homePage/course4.webp"
import course5 from "../../assets/homePage/course5.webp"
import searchType from "../../assets/homePage/searchType.png"
import Image from 'next/image';
import Footer from '../components/footer/page';
import ProfileCard from '../components/profileCard/page';
import NavigatorMenu from '../components/navigatorMenu/page';
import { useRouter, useSearchParams } from 'next/navigation'

const SearchPage = () => {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('publishDate');
  const [sortOrder, setSortOrder] = useState('ascend');
  const router = useRouter();
  const searchParams = useSearchParams(); // 获取 URL 查询参数
  const keyword = searchParams.get('keyword'); // 获取 keyword 参数

  const fetchCourses = async () => {
    if (!keyword) {
      setLoading(true);
      try {

        const response = await fetch(`/api/courses`);

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
        console.log(data);
      } catch (err) {
        message.error('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    }
    else {
      setLoading(true);
      try {

        const response = await fetch(`/api/courses?keyword=${encodeURIComponent(keyword)}`);

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
        console.log(data);
      } catch (err) {
        message.error('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    }
  };

  // 在组件挂载时调用接口
  useEffect(() => {
    fetchCourses();
  }, [keyword]);


  // 点击事件处理，跳转到登录页面
  const handleLoginClick = () => {
    router.push("/auth/login");
  };

  // 点击事件处理，跳转到注册页面
  const handleRegisterClick = () => {
    router.push("/auth/register");
  };

  // 点击事件处理，跳转到课程详情页
  const handleCourseClick = (id) => {
    router.push(`/course/${id}`);
  };

  // 回车事件处理，触发页面跳转
  const handlePressEnter = () => {
    if (searchTerm.trim()) {
      router.push(`/searchPage?keyword=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // 排序函数
  const handleSort = () => {
    const sortedCourses = [...courses].sort((a, b) => {
      if (sortOrder === 'ascend') {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });
    setCourses(sortedCourses);
  };




  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };



  return (
    <div className={styles.container}>
      {/* 页首导航 */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image className={styles.logoIcon} src={logo} alt="Logo" />
          在线教育平台
        </div>
        {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{ width: '390px', fontSize: '16px' }} /> */}
        <NavigatorMenu initialCurrent={'course'} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索课程"
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: 260, marginRight: '60px' }}
            onPressEnter={handlePressEnter} // 监听回车事件
          />
          <Button type="primary" onClick={handleLoginClick}>登录</Button>
          <Button onClick={handleRegisterClick} style={{ marginLeft: 10 }}>注册</Button>
        </div>
      </div>

      <div className={styles.typeContent}>
        <Image className={styles.searchType} src={searchType} alt="searchType" />
      </div>
      <div className={styles.courseList}>
        <div className={styles.recommendedCoursesTitle}>
          <h2>搜索结果</h2>
          <div className={styles.filterControls}>
            <Select
              value={sortField}
              onChange={(value) => setSortField(value)}
              style={{ width: 200, marginRight: 10 }}

            >
              <Select.Option value="publishDate">发布时间</Select.Option>
              <Select.Option value="registrationCount">注册人数</Select.Option>
              <Select.Option value="updateDate">更新时间</Select.Option>
              <Select.Option value="likes">点赞人数</Select.Option>
            </Select>

            <Select
              value={sortOrder}
              onChange={(value) => setSortOrder(value)}
              style={{ width: 120, marginRight: 10 }}
            >
              <Select.Option value="ascend">升序</Select.Option>
              <Select.Option value="descend">降序</Select.Option>
            </Select>

            <Button type="primary" onClick={handleSort}>
              排序
            </Button>
          </div>
        </div>
        {loading ? (
          <Spin tip="加载中..." />
        ) : (
          <Row gutter={[24, 24]} justify="start">
            {courses.map((course) => (
              <Col xs={24} sm={12} md={8} lg={8} key={course.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt="课程封面"
                      src={course.thumbnail || "/image/chinese.png"}
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                  }
                  onClick={() => handleCourseClick(course.id)}
                >
                  <Title level={4}>
                    <span style={{ color: "#000000", fontWeight: "bold" }}>
                      {course.title}
                    </span>
                  </Title>
                  {/* 标签部分 */}
                  {/* {course.isNational && ( */}
                  <Tag color="gold">国家线上一流课程</Tag>
                  {/* )} */}
                  {/* {course.isRecommended && ( */}
                  <Tag color="green">高校推荐课程</Tag>
                  {/* )} */}

                  {/* 学校与讲师 */}
                  <Paragraph style={{ marginTop: '10px' }}>
                    <strong>{course.school || "深圳大学"}</strong> / {course.instructor_name || "张三"}
                  </Paragraph>

                  {/* 课程简要 */}
                  <Paragraph ellipsis={{ rows: 2, expandable: false }}>
                    {course.description}
                  </Paragraph>

                  {/* 状态展示 */}
                  <div>
                    <Tag color="blue">
                      <CheckCircleOutlined /> 已结束
                    </Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>)}
      </div>





      {/* 页脚 */}
      <div className={styles.footer}>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default SearchPage;
