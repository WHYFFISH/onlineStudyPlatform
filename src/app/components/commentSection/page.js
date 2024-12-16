// components/CommentSection.js
import React, { useState } from 'react';
import { List, Avatar, Button, Input, Space, Checkbox, Typography, Select } from 'antd';
import { MessageOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// 示例评论数据
const comments = [
  {
    id: 1,
    author: '梅钿凡',
    avatar: 'https://i.pravatar.cc/100?img=1',
    content: '视频看完也有75分了',
    replies: 0,
    views: 2,
    updatedAt: '2024-12-12 15:17',
  },
  {
    id: 2,
    author: '陈辛辛',
    avatar: 'https://i.pravatar.cc/100?img=2',
    content: '可以补考吗???',
    replies: 1,
    views: 4,
    updatedAt: '2024-12-12 11:58',
  },
  {
    id: 3,
    author: '李诗诗',
    avatar: '',
    content: '2. 应用领域',
    replies: 1,
    views: 3,
    updatedAt: '2024-12-10 21:36',
  },
  {
    id: 4,
    author: '李诗诗',
    avatar: '',
    content: '人工智能行业是一个快速发展的领域，涵盖了多种技术、应用和服务，其核心目标是通过模拟人类智能来提高效率，减少成本和改善决策。',
    replies: 0,
    views: 1,
    updatedAt: '2024-12-10 21:13',
  },
  {
    id: 5,
    author: '王鱼鱼',
    avatar: '',
    content: '没考试是不是也有B',
    replies: 0,
    views: 1,
    updatedAt: '2024-12-10 21:13',
  },
  {
    id: 6,
    author: '李韩寒',
    avatar: '',
    content: '2. 应用领域',
    replies: 0,
    views: 1,
    updatedAt: '2024-12-10 21:13',
  },
];

const CommentSection = () => {
  const [filteredComments, setFilteredComments] = useState(comments);
  const [showTeachersOnly, setShowTeachersOnly] = useState(false);

  // 搜索功能
  const handleSearch = (value) => {
    const filtered = comments.filter((comment) => comment.content.includes(value));
    setFilteredComments(filtered);
  };

  // 筛选功能
  const handleCheckboxChange = (e) => {
    setShowTeachersOnly(e.target.checked);
    if (e.target.checked) {
      // 假设教师的评论都带有特定标记，这里示例中没有实际区分
      setFilteredComments(comments.filter((comment) => comment.author === '李诗诗'));
    } else {
      setFilteredComments(comments);
    }
  };

  return (
    <div style={{ maxWidth: 950, margin: '0 auto', padding: '30px' }}>
      <Title level={3}>综合讨论</Title>

      <Space style={{ marginBottom: '1rem', width: '100%' }} direction="horizontal">
        <Search
          placeholder="请输入关键词"
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          style={{ flex: 1 }}
        />
        {/* <Button type="primary">发起讨论</Button>
        <Checkbox onChange={handleCheckboxChange}>仅显示教师参与</Checkbox>
        <Select defaultValue="全部帖子" style={{ width: 120 }}>
          <Option value="all">全部帖子</Option>
          <Option value="popular">热门帖子</Option>
        </Select> */}
      </Space>

      <List
        itemLayout="horizontal"
        dataSource={filteredComments}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                item.avatar ? (
                  <Avatar src={item.avatar} />
                ) : (
                  <Avatar>{item.author.charAt(0)}</Avatar>
                )
              }
              title={<Text strong>{item.content}</Text>}
              description={
                <>
                  <Text type="secondary">{item.author}</Text>
                  <br />
                  <Text type="secondary">
                    {item.replies} 回复 · {item.views} 浏览 · 最后更新：{dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm')}
                  </Text>
                </>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default CommentSection;
