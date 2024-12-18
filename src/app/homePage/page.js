"use client"
import { Select, Carousel, Menu, Card, Row, Col, Button, Input, Badge, notification, List, Divider } from 'antd';
import React,{ useState, useEffect } from 'react';
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
import Image from 'next/image';
import Footer from '../components/footer/page';
import ProfileCard from '../components/profileCard/page';
import NavigatorMenu from '../components/navigatorMenu/page';
import { useRouter } from 'next/navigation'

const HomePage = () => {

  const [courses, setCourses] = useState([]);
  const [hotCourses, setHotCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('publishDate');
  const [sortOrder, setSortOrder] = useState('ascend');
  const router = useRouter();
  const [userRole, setUserRole] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/courses');
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
  };

  // 在组件挂载时检查 localStorage
  React.useEffect(() => {
    fetchCourses();
    // 获取 localStorage 中的 userId
    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('rememberedAccount');

    // 如果 userId 存在，表示用户已登录
    if (userRole) {
      setUserRole(userRole);
      // setUserName(userName);
    }
  }, []); // 空数组，表示只在组件挂载时执行一次

  useEffect(() => {
    // 对 courses 按照 registration_count 进行降序排序
    const sortedCourses = [...courses].sort((a, b) => b.registration_count - a.registration_count);
    // 将排序后的课程存入 hotCourses
    setHotCourses(sortedCourses);
  }, [courses])


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

  // 回车事件处理，触发页面跳转
  const handlePressEnter = () => {
    if (searchTerm.trim()) {
      router.push(`/searchPage?keyword=${encodeURIComponent(searchTerm.trim())}`);
    }
  };



  const courseItems = ['全科备考', '择校', '英语'];

  return (
    <div className={styles.container}>
      {/* 页首导航 */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image className={styles.logoIcon} src={logo} alt="Logo" priority/>
          在线教育平台
        </div>
        {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{ width: '390px', fontSize: '16px' }} /> */}
        <NavigatorMenu initialCurrent={'home'} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索课程"
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: 260, marginRight: '60px' }}
            onPressEnter={handlePressEnter} // 监听回车事件
          />
          {!userRole && (
            <div>
              <Button type="primary" onClick={handleLoginClick}>登录</Button>
              <Button onClick={handleRegisterClick} style={{ marginLeft: 10 }}>注册</Button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.banner}>
        <div className={styles.leftContent}>
          <div className={styles.typeItem}>
            <div className={styles.typeItemTitle}>
              名师公开课
              <div className={styles.typeItemContent}>
                <div className={styles.typeItemContentItem}>
                  {courseItems.map((item, index) => (

                    <span key={index}>
                      {item} {index < courseItems.length - 1 && ' / '}
                    </span>

                  ))}
                </div>

              </div>
            </div>
          </div>
          <div className={styles.typeItem}>
            <div className={styles.typeItemTitle}>
              25考研
              <div className={styles.typeItemContent}>
                <div className={styles.typeItemContentItem}>
                  {courseItems.map((item, index) => (

                    <span key={index}>
                      {item} {index < courseItems.length - 1 && ' / '}
                    </span>

                  ))}
                </div>

              </div>
            </div>
          </div>
          <div className={styles.typeItem}>
            <div className={styles.typeItemTitle}>
              26考研
              <div className={styles.typeItemContent}>
                <div className={styles.typeItemContentItem}>
                  {courseItems.map((item, index) => (

                    <span key={index}>
                      {item} {index < courseItems.length - 1 && ' / '}
                    </span>

                  ))}
                </div>

              </div>
            </div>
          </div>
          <div className={styles.typeItem}>
            <div className={styles.typeItemTitle}>
              更多课程
              <div className={styles.typeItemContent}>
                <div className={styles.typeItemContentItem}>
                  {courseItems.map((item, index) => (

                    <span key={index}>
                      {item} {index < courseItems.length - 1 && ' / '}
                    </span>

                  ))}
                </div>

              </div>
            </div>
          </div>
          <div className={styles.typeItem}>
            <div className={styles.typeItemTitle}>
              名师公开课
              <div className={styles.typeItemContent}>
                <div className={styles.typeItemContentItem}>
                  {courseItems.map((item, index) => (

                    <span key={index}>
                      {item} {index < courseItems.length - 1 && ' / '}
                    </span>

                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className={styles.carousel}>
          <Carousel autoplay>
            <div>
              <Image className={styles.carouselImage} src={carousel1} alt="carousel1" priority/>
            </div>
            <div>
              <Image className={styles.carouselImage} src={carousel2} alt="carousel1" priority/>
            </div>
            <div>
              <Image className={styles.carouselImage} src={carousel3} alt="carousel1" priority/>
            </div>
          </Carousel>
        </div>
        <div className={styles.rightContent}>
          <ProfileCard />
        </div>

      </div>


      {/* 推荐课程 */}
      <div className={styles.recommendedCoursesTitle}>
        <h2>推荐课程</h2>
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
      <div className={styles.recommendedCoursesList}>
        {courses.map((course) => (
          <div key={course.id} className={styles.recommendedCoursesItem} onClick={() => handleCourseClick(course.id)}>
            <Image className={styles.courseImage} src={course.thumbnail && course.thumbnail !== '' ? course.thumbnail : course1}
              alt={course.title} width={200} height={120} priority/>
            <div className={styles.courseName}>{course.title}</div>
            <div className={styles.courseSchool}>{course.instructor_name}</div>
            <div className={styles.courseDetails}>
              <p>点赞人数：{course.likes}</p>
              <p>注册人数：{course.registration_count}</p>
              <p>发布时间：{course.created_at}</p>
              <p>更新时间：{course.updated_at}</p>

            </div>
          </div>
        ))}
      </div>

      {/* 热门课程 */}
      <div className={styles.recommendedCoursesTitle}>
        <h2>热门课程</h2>

      </div>
      <div className={styles.recommendedCoursesList}>
        {hotCourses.map((course) => (
          <div key={course.id} className={styles.recommendedCoursesItem} onClick={() => handleCourseClick(course.id)}>
            <Image className={styles.courseImage} src={course.thumbnail && course.thumbnail !== '' ? course.thumbnail : course1}
              alt={course.title} width={200} height={120} priority/>
            <div className={styles.courseName}>{course.title}</div>
            <div className={styles.courseSchool}>{course.instructor_name}</div>
            <div className={styles.courseDetails}>
              <p>点赞人数：{course.likes}</p>
              <p>注册人数：{course.registration_count}</p>
              <p>发布时间：{course.created_at}</p>
              <p>更新时间：{course.updated_at}</p>

            </div>
          </div>
        ))}
      </div>

      {/* 最新课程 */}
      <div className={styles.recommendedCoursesTitle}>
        <h2>最新课程</h2>
      </div>
      <div className={styles.recommendedCoursesList}>
        {courses.map((course) => (
          <div key={course.id} className={styles.recommendedCoursesItem} onClick={() => handleCourseClick(course.id)}>
            <Image className={styles.courseImage} src={course.thumbnail && course.thumbnail !== '' ? course.thumbnail : course1}
              alt={course.title} width={200} height={120} priority/>
            <div className={styles.courseName}>{course.title}</div>
            <div className={styles.courseSchool}>{course.instructor_name}</div>
            <div className={styles.courseDetails}>
              <p>点赞人数：{course.likes}</p>
              <p>注册人数：{course.registration_count}</p>
              <p>发布时间：{course.created_at}</p>
              <p>更新时间：{course.updated_at}</p>

            </div>
          </div>
        ))}
      </div>




      {/* 页脚 */}
      <div className={styles.footer}>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default HomePage;
