"use client"
import React from 'react';
import { Button, Avatar, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import avatarImg from '../../../assets/homePage/avatar.jpg'; // 引入头像图片
import styles from './ProfileCard.module.css'; // 引入样式文件
import Image from 'next/image';
import { useRouter } from 'next/navigation'

const ProfileCard = () => {
  const router = useRouter();
  const [userRole, setUserRole] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const toPersonalPage = () => {
    if (userRole === 'student') {
      router.push('/student');
    }
    else{
      router.push('/teacher');
    }
    
  }
  // 在组件挂载时检查 localStorage
  React.useEffect(() => {
    // 获取 localStorage 中的 userId
    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('name');

    // 如果 userId 存在，表示用户已登录
    if (userRole) {
      setUserRole(userRole);
      setUserName(userName);
    }
  }, []); // 空数组，表示只在组件挂载时执行一次

  return (
    <Card className={styles.profileCard}>
      <div className={styles.profileContent}>
        {/* <Avatar
          size={100}
          src={avatarImg}
          className={styles.avatar}
        /> */}

        {userRole ? (
          <Image src={avatarImg} alt='avatar'
            className={styles.avatar} priority></Image>) : (
          <Avatar
            size={100}
            icon={<UserOutlined />}
            className={styles.avatar} />
        )}

        {userRole ? (
          <h2 className={styles.userName}>{userName}</h2>) : (
          <h2 className={styles.userName}>请登录</h2>
        )}
        {userRole ? (
          <Button type="primary" className={styles.courseButton} onClick={toPersonalPage}>
            个人中心
          </Button>) : (
          <Button type="primary" className={styles.courseButton} onClick={toPersonalPage} disabled>
            个人中心
          </Button>
        )}

      </div>
    </Card>
  );
};

export default ProfileCard;
