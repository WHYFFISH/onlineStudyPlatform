import React from 'react';
import { Button, Avatar, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import avatarImg from '../../../assets/homePage/avatar.jpg'; // 引入头像图片
import styles from './ProfileCard.module.css'; // 引入样式文件
import Image from 'next/image';
import { useRouter } from 'next/navigation'

const ProfileCard = () => {
  const router = useRouter();
  const toPersonalPage = () => {
    router.push('/student');
  }
  return (
    <Card className={styles.profileCard}>
      <div className={styles.profileContent}>
        {/* <Avatar
          size={100}
          src={avatarImg}
          className={styles.avatar}
        /> */}
        <Image src={avatarImg} alt='avatar'
          className={styles.avatar}></Image>
       
        <h2 className={styles.userName}>用户名</h2>
        <Button type="primary" className={styles.courseButton} onClick={toPersonalPage}>
          个人中心
        </Button>
      </div>
    </Card>
  );
};

export default ProfileCard;
