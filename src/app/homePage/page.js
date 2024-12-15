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
  // 课程数据数组
  const initialCourses = [
    {
      id: 1,
      name: '庄子精讲',
      school: '深圳大学',
      author: '王阳明',
      image: course1,
      publishDate: '2023-01-15',
      registrationCount: 150,
      updateDate: '2024-01-01',
      likes: 200,
    },
    {
      id: 2,
      name: '音乐与健康',
      school: '深圳大学',
      author: '王阳明',
      image: course2,
      publishDate: '2023-02-20',
      registrationCount: 300,
      updateDate: '2024-02-10',
      likes: 450,
    },
    {
      id: 3,
      name: '谈判技巧',
      school: '深圳大学',
      author: '王阳明',
      image: course3,
      publishDate: '2023-03-10',
      registrationCount: 180,
      updateDate: '2024-03-05',
      likes: 220,
    },
    {
      id: 4,
      name: '数字电路',
      school: '深圳大学',
      author: '王阳明',
      image: course4,
      publishDate: '2022-12-10',
      registrationCount: 500,
      updateDate: '2024-01-15',
      likes: 600,
    },
    {
      id: 5,
      name: '线性代数',
      school: '深圳大学',
      author: '王阳明',
      image: course5,
      publishDate: '2023-05-05',
      registrationCount: 250,
      updateDate: '2024-04-01',
      likes: 320,
    },
  ];

  const [courses, setCourses] = useState(initialCourses);
  console.log(courses)

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('publishDate');
  const [sortOrder, setSortOrder] = useState('ascend');
  const router = useRouter();

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
        <NavigatorMenu initialCurrent={'course'}/>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索课程"
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: 260, marginRight: '60px' }}
          />
          <Button type="primary">登录</Button>
          <Button style={{ marginLeft: 10 }}>注册</Button>
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
            <Image className={styles.courseImage} src={course.image} alt={course.name} width={200} height={120} />
            <div className={styles.courseName}>{course.name}</div>
            <div className={styles.courseSchool}>{course.school} {course.author}</div>
            <div className={styles.courseDetails}>
              <p>点赞人数：{course.likes}</p>
              <p>注册人数：{course.registrationCount}</p>
              <p>发布时间：{course.publishDate}</p>
              <p>更新时间：{course.updateDate}</p>

            </div>
          </div>
        ))}
      </div>

      {/* 推荐课程 */}
      <div className={styles.recommendedCoursesTitle}>
        <h2>热门课程</h2>
      </div>
      <div className={styles.recommendedCoursesList}>
        <div className={styles.recommendedCoursesItem}>
          <Image className={styles.courseImage} src={course1} alt="course" />
          <div className={styles.courseName}>
            庄子精讲
          </div>
          <div className={styles.courseSchool}>
            深圳大学
          </div>
          <div className={styles.courseAuthor}>
            王阳明
          </div>
        </div>
        <div className={styles.recommendedCoursesItem}>
          <Image className={styles.courseImage} src={course2} alt="course" />
          <div className={styles.courseName}>
            音乐与健康
          </div>
          <div className={styles.courseSchool}>
            深圳大学
          </div>
          <div className={styles.courseAuthor}>
            王阳明
          </div>

        </div>
        <div className={styles.recommendedCoursesItem}>
          <Image className={styles.courseImage} src={course3} alt="course" />
          <div className={styles.courseName}>
            谈判技巧
          </div>
          <div className={styles.courseSchool}>
            深圳大学
          </div>
          <div className={styles.courseAuthor}>
            王阳明
          </div>
        </div>
        <div className={styles.recommendedCoursesItem}>
          <Image className={styles.courseImage} src={course4} alt="course" />
          <div className={styles.courseName}>
            数字电路
          </div>
          <div className={styles.courseSchool}>
            深圳大学
          </div>
          <div className={styles.courseAuthor}>
            王阳明
          </div>
        </div>
        <div className={styles.recommendedCoursesItem}>
          <Image className={styles.courseImage} src={course5} alt="course" />
          <div className={styles.courseName}>
            线性代数
          </div>
          <div className={styles.courseSchool}>
            深圳大学
          </div>
          <div className={styles.courseAuthor}>
            王阳明
          </div>
        </div>
        <div className={styles.recommendedCoursesItem}>

        </div>
        <div className={styles.recommendedCoursesItem}>

        </div>
        <div className={styles.recommendedCoursesItem}>

        </div>
      </div>




      {/* 页脚 */}
      <div className={styles.footer}>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default HomePage;
