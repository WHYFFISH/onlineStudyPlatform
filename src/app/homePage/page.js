"use client"
import { Select, Carousel, Menu, Card, Row, Col, Button, Input, Badge, notification, List, Divider } from 'antd';
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
import Image from 'next/image';
import Footer from '../components/footer/page';
import ProfileCard from '../components/profileCard/page';
import NavigatorMenu from '../components/navigatorMenu/page';
import { useRouter } from 'next/navigation'

const HomePage = () => {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('publishDate');
  const [sortOrder, setSortOrder] = useState('ascend');
  const router = useRouter();

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

  // 在组件挂载时调用接口
  useEffect(() => {
    fetchCourses();
  }, []);

  
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



  const courseItems = ['全科备考', '择校', '英语'];

  return (
    <div className={styles.container}>
      {/* 页首导航 */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image className={styles.logoIcon} src={logo} alt="Logo" />
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
          />
          <Button type="primary" onClick={handleLoginClick}>登录</Button>
          <Button onClick={handleRegisterClick} style={{ marginLeft: 10 }}>注册</Button>
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
              <Image className={styles.carouselImage} src={carousel1} alt="carousel1" />
            </div>
            <div>
              <Image className={styles.carouselImage} src={carousel2} alt="carousel1" />
            </div>
            <div>
              <Image className={styles.carouselImage} src={carousel3} alt="carousel1" />
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
              alt={course.title} width={200} height={120} />
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
              alt={course.title} width={200} height={120} />
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
              alt={course.title} width={200} height={120} />
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
