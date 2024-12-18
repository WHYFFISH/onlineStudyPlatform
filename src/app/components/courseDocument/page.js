
"use client"
// components/DocumentList.js
import React, { useState } from 'react';
import { List, Input, Button, Typography, Space, Tooltip } from 'antd';
import { FilePdfOutlined, FileOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;

// 文档数据示例
const documents = [
  { id: 1, name: '中国人工智能发展态势及其促进策略.pdf', section: '第1节 人工智能的发展历程和趋势', type: 'pdf' },
  { id: 2, name: '探究人工智能的发展史与应用.pdf', section: '第1节 人工智能的发展历程和趋势', type: 'pdf' },
  { id: 3, name: '关于人工智能未来发展的探究.pdf', section: '第1节 人工智能的发展历程和趋势', type: 'pdf' },
  { id: 4, name: '人工智能是什么.mp4', section: '第1节 人工智能的发展历程和趋势', type: 'mp4' },
  { id: 5, name: '十分钟了解人工智能AI的基础运行原理.pdf', section: '第2节 如何理解人工智能的核心', type: 'pdf' },
  { id: 6, name: '人工智能的应用领域.pdf', section: '第2节 如何理解人工智能的核心', type: 'pdf' },
];

const CourseDocument = () => {
  const [filteredDocs, setFilteredDocs] = useState(documents);

  // 过滤文档函数
  const handleSearch = (value) => {
    const filtered = documents.filter((doc) => doc.name.includes(value));
    setFilteredDocs(filtered);
  };

  return (
    <div style={{ maxWidth: 950, margin: '0 auto', padding: '30px' }}>
      <Title level={3}>课程文档</Title>
      <Space style={{ marginBottom: '1rem', width: '100%' }} direction="vertical" >
        <Search placeholder="请输入关键词" onSearch={handleSearch} enterButton />
      </Space>

      <List
        itemLayout="horizontal"
        dataSource={filteredDocs}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Tooltip title="预览">
                <Button type="link" icon={<EyeOutlined />} href={`/file/courseFile.pdf`}
                  target="_blank"  // 在新标签页打开文件
                  rel="noopener noreferrer"  // 安全性设置，防止恶意代码
                />
              </Tooltip>,
              <Tooltip title="下载">
                <Button type="link" icon={<DownloadOutlined />} href={`/file/courseFile.pdf`}
                  download={item.name}
                />
              </Tooltip>,
            ]}
          >
            <List.Item.Meta
              avatar={<FileIcon type={item.type} />}
              title={<a href="#">{item.name}</a>}
              description={item.section}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

// 根据文件类型显示不同的图标
const FileIcon = ({ type }) => {
  if (type === 'pdf') {
    return <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />;
  } else if (type === 'mp4') {
    return <FileOutlined style={{ fontSize: '24px', color: '#1890ff' }} />;
  }
  return <FileOutlined style={{ fontSize: '24px', color: '#595959' }} />;
};

export default CourseDocument;